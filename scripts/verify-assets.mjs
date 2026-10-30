import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const sourceDirs = [path.join(root, "src", "components", "v1"), path.join(root, "src", "lib")];
const files = (await Promise.all(sourceDirs.map(async (directory) =>
  (await fs.readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
    .map((entry) => path.join(directory, entry.name)),
))).flat();
const checked = new Set();
const errors = [];

for (const filePath of files) {
  const file = path.relative(root, filePath);
  const source = await fs.readFile(filePath, "utf8");
  for (const match of source.matchAll(/["'`]((?:\/)[^"'`\s$]*)["'`]/g)) {
    const reference = match[1].split(/[?#]/)[0];
    if (reference === "/" || reference.startsWith("//")) continue;

    const relativePath = reference.replace(/^\//, "");
    const absolutePath = path.join(publicDir, relativePath);
    const hasMediaExtension = Boolean(path.extname(relativePath));
    try {
      const stat = await fs.stat(absolutePath);
      if (stat.isFile() && (hasMediaExtension || /.(?:png|jpe?g|gif|webp|avif|svg|mp[34]|wav|m4a|glb|gltf|hdr)$/i.test(relativePath))) {
        checked.add(reference);
        if (stat.size === 0) errors.push(`${file}: ${reference} is empty`);
      } else if (stat.isDirectory()) {
        checked.add(`${reference}/`);
        const entries = await fs.readdir(absolutePath);
        if (entries.length === 0) errors.push(`${file}: ${reference} is an empty asset directory`);
      }
    } catch {
      if (hasMediaExtension) errors.push(`${file}: missing ${reference}`);
    }
  }
}

console.log(`Checked ${checked.size} local asset references across ${files.length} component files.`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All referenced local assets exist and are non-empty.");
}
