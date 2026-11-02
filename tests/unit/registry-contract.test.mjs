import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "rea-skipper-manifest.json"), "utf8"));
const registrySource = fs.readFileSync(path.join(root, "src/lib/registry.ts"), "utf8");

test("manifest keeps upstream provenance distinct from the local skipper93 implementation", () => {
  assert.equal(manifest.length, 107);
  assert.equal(manifest.filter((entry) => entry.status === "verified" && entry.verification === "pass").length, 106);
  const original = manifest.find((entry) => entry.id === "skipper93");
  assert.equal(original.status, "upstream_404");
  assert.equal(original.upstreamAvailability, "upstream_404");
  assert.equal(original.localImplementation, "present");
  assert.equal(original.localVerification, "pass");
  assert.equal(fs.statSync(path.join(root, "src/components/v1/skipper93.tsx")).size > 0, true);
  assert.match(registrySource, /skipper93:\s*\(\)\s*=>\s*import\("@\/components\/v1\/skipper93"\)/);
});

test("every verified manifest entry has source, lazy loader and remote registry JSON", () => {
  const componentDir = path.join(root, "src/components/v1");
  const components = fs.readdirSync(componentDir).filter((name) => /^skipper\d+\.tsx$/.test(name));
  assert.equal(components.length, 107);
  for (const file of components) {
    const source = fs.readFileSync(path.join(componentDir, file), "utf8");
    assert.match(source, /^\s*["']use client["'];/, `${file} must be a client component`);
    assert.equal(source.includes("http://localhost:3000"), false, `${file} must use portable relative URLs`);
  }
  for (const entry of manifest.filter((item) => item.status === "verified")) {
    const id = entry.id;
    const number = id.replace("skipper", "");
    assert.ok(fs.statSync(path.join(root, "src/components/v1", `${id}.tsx`)).size > 0, `${id} source`);
    assert.ok(registrySource.includes(`${id}: () => import(`), `${id} loader`);
    assert.ok(fs.statSync(path.join(root, "public/r", `skiper${number}.json`)).size > 0, `${id} registry item`);
  }
});

test("component asset literals resolve to nonempty public files", () => {
  const dir = path.join(root, "src/components/v1");
  const pattern = /["'`]((?:\/(?:skipperv1|images|mac|audio|videos|models|svgs|data|examples|showreel|thumbnails)\/)[^"'`\s$]*?\.(?:png|jpe?g|gif|webp|avif|svg|mp4|mp3|m4a|wav|glb|gltf|hdr))["'`]/gi;
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".tsx"))) {
    const source = fs.readFileSync(path.join(dir, file), "utf8");
    for (const [, url] of source.matchAll(pattern)) {
      const asset = path.join(root, "public", url.slice(1));
      assert.ok(fs.existsSync(asset), `${file}: ${url}`);
      assert.ok(fs.statSync(asset).size > 0, `${file}: ${url} is empty`);
    }
  }
});

test("literal SVG filter and clipPath identifiers do not collide across components", () => {
  const seen = new Map();
  const pattern = /<(?:filter|clipPath)\b[^>]*\bid=["']([^"']+)["']/gi;
  for (const file of fs.readdirSync(path.join(root, "src/components/v1")).filter((name) => name.endsWith(".tsx"))) {
    const source = fs.readFileSync(path.join(root, "src/components/v1", file), "utf8");
    for (const [, id] of source.matchAll(pattern)) {
      assert.equal(seen.has(id), false, `duplicate SVG id "${id}" in ${file}; first in ${seen.get(id)}`);
      seen.set(id, file);
    }
  }
});
