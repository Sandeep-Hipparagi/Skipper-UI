import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const catalog = JSON.parse(fs.readFileSync(path.join(root, "src/lib/side-by-side-data.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "rea-skipper-manifest.json"), "utf8"));
const registrySource = fs.readFileSync(path.join(root, "src/lib/registry.ts"), "utf8");

test("catalog has unique, complete slots and matching component, preview, and thumbnail files", () => {
  assert.equal(catalog.length, 107);
  assert.deepEqual(catalog.map((entry) => entry.number).sort((a, b) => a - b), Array.from({ length: 107 }, (_, index) => index + 1));

  for (const entry of catalog) {
    assert.equal(entry.localSpecUrl, `/v1/${entry.id}`);
    assert.equal(entry.localPreviewUrl, `/v1/preview/${entry.id}`);
    assert.ok(fs.statSync(path.join(root, "src/components/v1", `${entry.id}.tsx`)).size > 0, `${entry.id} component is missing`);
    assert.ok(fs.statSync(path.join(root, "public/thumbnails", `${entry.id}.webp`)).size > 0, `${entry.id} thumbnail is missing`);
  }
});

test("typed registry contains a dynamic loader for every catalog slot", () => {
  const loaders = [...registrySource.matchAll(/^  (skipper\d+): \(\) => import\(/gm)].map((match) => match[1]);
  assert.equal(loaders.length, 107);
  assert.deepEqual([...loaders].sort(), catalog.map((entry) => entry.id).sort());
});

test("manifest accurately reflects 106 verified components and 1 upstream_404 (skipper93)", () => {
  const verified = manifest.filter((entry) => entry.status === "verified" && entry.verification === "pass");
  const upstream404 = manifest.filter((entry) => entry.status === "upstream_404" && entry.verification === "not_applicable");
  assert.equal(verified.length, 106);
  assert.equal(upstream404.length, 1);
  assert.equal(upstream404[0].id, "skipper93");
  assert.equal(fs.existsSync(path.join(root, "src/components/v1/skipper93.tsx")), true);
});
