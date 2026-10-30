const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../src/components/v1');
const files = fs.readdirSync(dir).filter(f => /^skipper\d+\.tsx$/.test(f));

for (const f of files) {
  const code = fs.readFileSync(path.join(dir, f), 'utf8');
  // Check listener patterns
  const re = /(window|document|container|el|element|ref\.current)\.addEventListener\s*\(\s*['"](mousemove|pointermove|scroll)['"]\s*,\s*([a-zA-Z0-9_]+|\([^)]*\)\s*=>)/g;
  let m;
  while ((m = re.exec(code)) !== null) {
    const handler = m[3];
    if (handler.startsWith('(')) {
      // inline arrow function
      if (/set[A-Z]/.test(handler)) {
        console.log(`${f}: inline listener with setter in ${m[2]}`);
      }
    } else {
      // named function: find definition
      const funcRegex = new RegExp(`const\\s+${handler}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{([\\s\\S]*?)\\};?`, 'm');
      const fMatch = code.match(funcRegex);
      if (fMatch && /set[A-Z]/.test(fMatch[1])) {
        // Check if throttled or using raf
        const isThrottled = fMatch[1].includes('requestAnimationFrame') || fMatch[1].includes('throttle') || fMatch[1].includes('isPending');
        console.log(`${f}: handler ${handler} calls setter in ${m[2]} (throttled=${isThrottled})`);
      }
    }
  }
}
