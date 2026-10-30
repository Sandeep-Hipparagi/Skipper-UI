const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
const projectRoot = process.cwd();
const args = process.argv.slice(2);
const id = args[0];
const destinationFlag = args.indexOf("--dest");
let destination = destinationFlag >= 0 ? args[destinationFlag + 1] : undefined;
if (!destination && process.env.npm_config_dest && process.env.npm_config_dest !== "true") {
  destination = process.env.npm_config_dest;
}
if (!destination && args[1] && !args[1].startsWith("--")) {
  destination = args[1];
}

if (!/^skipper(?:[1-9]|[1-9]\d|10[0-7])$/.test(id ?? "") || !destination) {
  console.error("Usage: npm run export:component -- skipper24 --dest ../my-new-app");
  process.exit(1);
}

const appRoot = path.resolve(destination);
const sourceFiles = new Map<string, string>();
const npmPackages = new Set<string>();
const assets = new Set<string>();
const rootPackage = JSON.parse(await fs.readFile(path.join(projectRoot, "package.json"), "utf8"));
const availablePackages = { ...rootPackage.dependencies, ...rootPackage.devDependencies };

function packageName(specifier: string): string | null {
  if (specifier.startsWith(".") || specifier.startsWith("@/")) return null;
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

async function resolveSource(specifier: string, importer: string): Promise<string> {
  const base = specifier.startsWith("@/")
    ? path.join(projectRoot, "src", specifier.slice(2))
    : path.resolve(path.dirname(importer), specifier);
  for (const candidate of [base, `${base}.tsx`, `${base}.ts`, `${base}.jsx`, `${base}.js`, path.join(base, "index.tsx"), path.join(base, "index.ts")]) {
    try {
      if ((await fs.stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  throw new Error(`Cannot resolve local import ${specifier} from ${path.relative(projectRoot, importer)}`);
}

async function visitSource(filePath: string): Promise<void> {
  if (sourceFiles.has(filePath)) return;
  const source = await fs.readFile(filePath, "utf8");
  sourceFiles.set(filePath, source);

  for (const match of source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)) {
    const specifier = match[1];
    const packageId = packageName(specifier);
    if (packageId) {
      if (!availablePackages[packageId]) throw new Error(`Package ${packageId} is not declared in package.json`);
      npmPackages.add(packageId);
    } else {
      await visitSource(await resolveSource(specifier, filePath));
    }
  }

  for (const match of source.matchAll(/["'`]((?:\/)[^"'`\s$]*)["'`]/g)) {
    const reference = match[1].replace(/^\//, "").split(/[?#]/)[0];
    if (reference) assets.add(reference);
  }
}

const componentPath = path.join(projectRoot, "src", "components", "v1", `${id}.tsx`);
await visitSource(componentPath);

for (const [sourcePath, sourceText] of sourceFiles) {
  const relativePath = path.relative(projectRoot, sourcePath);
  const destinationPath = path.join(appRoot, relativePath);
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });

  const rewritten = sourceText.replace(/(["'])(@\/[^"']+)\1/g, (_match, quote, specifier) => {
    const target = path.join(projectRoot, "src", specifier.slice(2));
    const targetWithExtension = [target, `${target}.tsx`, `${target}.ts`, `${target}.jsx`, `${target}.js`]
      .find((candidate) => sourceFiles.has(candidate));
    if (!targetWithExtension) return _match;
    let relative = path.relative(path.dirname(relativePath), path.relative(projectRoot, targetWithExtension)).replaceAll("\\", "/");
    relative = relative.replace(/\.(tsx?|jsx?)$/, "");
    if (!relative.startsWith(".")) relative = `./${relative}`;
    return `${quote}${relative}${quote}`;
  });
  await fs.writeFile(destinationPath, rewritten, "utf8");
}

for (const asset of assets) {
  const sourcePath = path.join(projectRoot, "public", asset);
  try {
    const stat = await fs.stat(sourcePath);
    if (stat.isDirectory()) {
      await fs.cp(sourcePath, path.join(appRoot, "public", asset), { recursive: true });
    } else if (stat.isFile() && stat.size > 0) {
      const destinationPath = path.join(appRoot, "public", asset);
      await fs.mkdir(path.dirname(destinationPath), { recursive: true });
      await fs.copyFile(sourcePath, destinationPath);
    } else {
      throw new Error(`Referenced asset is empty or unsupported: /${asset}`);
    }
  } catch (error) {
    if (path.extname(asset)) throw new Error(`Missing referenced asset /${asset}`, { cause: error });
  }
}

const installList = [...npmPackages]
  .sort()
  .map((name) => `${name}@${availablePackages[name]}`);
console.log(`Exported ${id} and ${sourceFiles.size - 1} local helper(s) to ${appRoot}`);
console.log(`Copied ${assets.size} referenced local asset path(s).`);
console.log(installList.length ? `Install dependencies: npm install ${installList.join(" ")}` : "No external npm packages required.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
