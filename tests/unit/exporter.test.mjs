import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "skipper-export-test-"));
test.after(() => fs.rmSync(temp, { recursive: true, force: true }));

test("exports skipper5 source, helpers and every image in its local gallery data", () => {
  const destination = path.join(temp, "skipper5-app");
  const result = spawnSync(process.execPath, ["--experimental-strip-types", "scripts/export-component.ts", "skipper5", "--dest", destination], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /npm install/);
  assert.match(fs.readFileSync(path.join(destination, "src/components/v1/skipper5.tsx"), "utf8"), /InfiniteGrid/);
  assert.ok(fs.existsSync(path.join(destination, "src/lib/utils.ts")));
  assert.ok(fs.existsSync(path.join(destination, "src/lib/example-images.ts")));
  const helper = fs.readFileSync(path.join(root, "src/lib/example-images.ts"), "utf8");
  const paths = [...helper.matchAll(/["'](\/examples\/[A-Za-z0-9_.-]+)["']/g)].map(([, asset]) => asset);
  assert.ok(paths.length >= 20, `expected at least 20 gallery assets, found ${paths.length}`);
  for (const asset of paths) {
    const copied = path.join(destination, "public", asset.slice(1));
    assert.ok(fs.existsSync(copied), asset);
    assert.ok(fs.statSync(copied).size > 0, asset);
  }
});

test("exports the locally authored skipper93 primitive through the one-p alias", () => {
  const destination = path.join(temp, "skiper93-app");
  const result = spawnSync(process.execPath, ["--experimental-strip-types", "scripts/export-component.ts", "skiper93", "--dest", destination], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(destination, "src/components/v1/skipper93.tsx")));
});
