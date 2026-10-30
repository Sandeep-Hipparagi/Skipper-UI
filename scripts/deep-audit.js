const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/components/v1');
const files = fs.readdirSync(dir)
  .filter(f => /^skipper\d+\.tsx$/.test(f))
  .sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10);
    const numB = parseInt(b.replace(/\D/g, ''), 10);
    return numA - numB;
  });

console.log(`Auditing ${files.length} component files...`);

const report = {};

for (const file of files) {
  const filePath = path.join(dir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // 1. Any type usage
  const anyMatches = [];
  const anyRegex = /(:|\bas\b|<)\s*any\b/g;
  let m;
  while ((m = anyRegex.exec(code)) !== null) {
    const line = code.substring(0, m.index).split('\n').length;
    anyMatches.push(line);
  }
  if (anyMatches.length > 0) {
    issues.push({ type: 'TYPE_ANY', count: anyMatches.length, lines: anyMatches.slice(0, 5) });
  }

  // 2. addEventListener vs removeEventListener
  const addListenerCount = (code.match(/addEventListener/g) || []).length;
  const removeListenerCount = (code.match(/removeEventListener/g) || []).length;
  if (addListenerCount > removeListenerCount) {
    issues.push({
      type: 'EVENT_LISTENER_LEAK',
      detail: `addEventListener: ${addListenerCount}, removeEventListener: ${removeListenerCount}`
    });
  }

  // 3. requestAnimationFrame vs cancelAnimationFrame
  const rafCount = (code.match(/requestAnimationFrame/g) || []).length;
  const cafCount = (code.match(/cancelAnimationFrame/g) || []).length;
  if (rafCount > 0 && cafCount === 0) {
    issues.push({
      type: 'RAF_LEAK',
      detail: `requestAnimationFrame called (${rafCount}x) but no cancelAnimationFrame found`
    });
  }

  // 4. setInterval vs clearInterval
  const setIntervalCount = (code.match(/\bsetInterval\s*\(/g) || []).length;
  const clearIntervalCount = (code.match(/\bclearInterval\s*\(/g) || []).length;
  if (setIntervalCount > clearIntervalCount) {
    issues.push({
      type: 'INTERVAL_LEAK',
      detail: `setInterval: ${setIntervalCount}, clearInterval: ${clearIntervalCount}`
    });
  }

  // 5. setTimeout in useEffect without clearTimeout
  const timeoutCount = (code.match(/\bsetTimeout\s*\(/g) || []).length;
  const clearTimeoutCount = (code.match(/\bclearTimeout\s*\(/g) || []).length;
  if (timeoutCount > 0 && clearTimeoutCount === 0 && code.includes('useEffect')) {
    // Only flag if inside useEffect
    if (/useEffect\s*\(\s*\(\)\s*=>[\s\S]*?setTimeout/.test(code)) {
      issues.push({
        type: 'TIMEOUT_LEAK',
        detail: `setTimeout in useEffect (${timeoutCount}x) but no clearTimeout`
      });
    }
  }

  // 6. ResizeObserver / IntersectionObserver without disconnect
  if (code.includes('ResizeObserver') && !code.includes('.disconnect()')) {
    issues.push({ type: 'OBSERVER_LEAK', detail: 'ResizeObserver instantiated without .disconnect()' });
  }
  if (code.includes('IntersectionObserver') && !code.includes('.disconnect()')) {
    issues.push({ type: 'OBSERVER_LEAK', detail: 'IntersectionObserver instantiated without .disconnect()' });
  }

  // 7. GSAP cleanup
  const hasGsap = code.includes('gsap.') || code.includes('ScrollTrigger');
  if (hasGsap) {
    const hasRevert = code.includes('.revert()');
    const hasKill = code.includes('.kill()');
    const hasKillAll = code.includes('ScrollTrigger.getAll') || code.includes('ScrollTrigger.killAll');
    if (!hasRevert && !hasKill && !hasKillAll) {
      issues.push({ type: 'GSAP_LEAK', detail: 'GSAP/ScrollTrigger used without ctx.revert() or .kill()' });
    }
  }

  // 8. Lenis cleanup
  if (code.includes('new Lenis') && !code.includes('.destroy()')) {
    issues.push({ type: 'LENIS_LEAK', detail: 'Lenis instantiated without .destroy()' });
  }

  // 9. Audio play without catch
  const playMatches = code.match(/\.play\(\)/g) || [];
  const catchMatches = code.match(/\.catch\(/g) || [];
  if (playMatches.length > catchMatches.length && (code.includes('new Audio') || code.includes('Audio('))) {
    issues.push({ type: 'AUDIO_UNGUARDED', detail: `Audio .play() (${playMatches.length}) might lack .catch()` });
  }

  // 10. Direct top-level window/document access
  const lines = code.split('\n');
  let inFunctionOrEffect = 0;
  const topLevelGlobals = [];
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;
    // Check if line accesses window or document at root (outside useEffect, function, or typeof window guard)
    // Basic heuristic: check if outside 'use client' header or top-level declarations
    if (/^\s*(const|let|var)\s+\w+\s*=\s*(window|document)\b/.test(line)) {
      if (!line.includes('typeof window')) {
        topLevelGlobals.push({ line: idx + 1, text: trimmed });
      }
    }
  });
  if (topLevelGlobals.length > 0) {
    issues.push({ type: 'SSR_GLOBAL_TRAP', items: topLevelGlobals });
  }

  if (issues.length > 0) {
    report[file] = issues;
  }
}

const issueFiles = Object.keys(report);
console.log(`\nScan complete. ${issueFiles.length} of ${files.length} components flagged for review.\n`);

console.log(JSON.stringify(report, null, 2));

fs.writeFileSync(path.join(__dirname, 'audit-results.json'), JSON.stringify(report, null, 2));
