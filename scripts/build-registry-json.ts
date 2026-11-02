import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const manifest = JSON.parse(await fs.readFile(path.join(root, "rea-skipper-manifest.json"), "utf8")) as Array<Record<string, unknown>>;
const catalog = JSON.parse(await fs.readFile(path.join(root, "src/lib/side-by-side-data.json"), "utf8")) as Array<Record<string, unknown>>;
const packageJson = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8")) as { dependencies: Record<string, string> };
const output = path.join(publicRoot, "r");
const siteUrl = process.env.REGISTRY_BASE_URL ?? "https://skipper-ui.vercel.app";
const mediaPattern = /["'`]((?:\/(?:skipperv1|images|mac|audio|videos|models|svgs|data|examples|showreel|thumbnails)\/)[^"'`\s$]*?\.(?:png|jpe?g|gif|webp|avif|svg|mp4|mp3|m4a|wav|glb|gltf|hdr))["'`]/gi;
const importPattern = /(?:from\s*|import\s*)["']([^"']+)["']/g;
const sourceUrl = (asset: string) => `${siteUrl}${asset}`;

await fs.mkdir(output, { recursive: true });
const items: Array<Record<string, unknown>> = [];

for (const record of catalog) {
  const id = String(record.id);
  const number = Number(id.replace("skipper", ""));
  if (!Number.isInteger(number) || number === 93) continue;
  const sourcePath = path.join(root, "src/components/v1", `${id}.tsx`);
  const original = await fs.readFile(sourcePath, "utf8");
  const dependencies = new Set<string>(Array.isArray(record.dependencies) ? record.dependencies.map(String) : []);
  const files = [{
    path: `components/v1/${id}.tsx`,
    content: original.replace(mediaPattern, (_match, asset: string) => JSON.stringify(sourceUrl(asset))),
    type: "registry:component",
    target: `@components/skipper-ui/${id}.tsx`,
  }];
  const helperFiles: Array<{ source: string; path: string; target: string }> = [];
  if (original.includes("@/lib/utils")) helperFiles.push({ source: "src/lib/utils.ts", path: "lib/utils.ts", target: "@lib/utils.ts" });
  if (original.includes("@/lib/example-images")) helperFiles.push({ source: "src/lib/example-images.ts", path: "lib/example-images.ts", target: "@lib/example-images.ts" });
  const helperSources = new Map<string, string>();
  for (const helper of helperFiles) {
    const helperSource = await fs.readFile(path.join(root, helper.source), "utf8");
    helperSources.set(helper.source, helperSource);
    files.push({
      path: helper.path,
      content: helperSource.replace(mediaPattern, (_match, asset: string) => JSON.stringify(sourceUrl(asset))),
      type: "registry:lib",
      target: helper.target,
    });
  }
  const assets = [...new Set([
    ...[...original.matchAll(mediaPattern)].map((match) => match[1]),
    ...[...helperSources.values()].flatMap((source) => [...source.matchAll(mediaPattern)].map((match) => match[1])),
  ])];
  for (const asset of assets) {
    const file = path.join(publicRoot, asset.slice(1));
    const stat = await fs.stat(file).catch(() => null);
    if (!stat?.isFile() || stat.size < 1) throw new Error(`${id} references missing/empty asset ${asset}`);
  }
  for (const file of files) {
    for (const match of file.content.matchAll(importPattern)) {
      const specifier = match[1];
      if (specifier.startsWith("@/") || specifier.startsWith(".")) continue;
      const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
      if (packageJson.dependencies[name]) dependencies.add(name);
    }
  }
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `skiper${number}`,
    type: "registry:block",
    title: String(record.title ?? id),
    description: String(record.description ?? `Interactive ${id} component from Skipper UI.`),
    dependencies: [...dependencies].sort(),
    registryDependencies: [],
    files,
    meta: {
      sourceId: id,
      assets: assets.map((url) => ({ path: url, url: sourceUrl(url) })),
      upstreamUrl: `https://skipper-ui.com/v1/${id}`,
    },
  };
  await fs.writeFile(path.join(output, `skiper${number}.json`), `${JSON.stringify(item, null, 2)}\n`);
  items.push({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    url: `${siteUrl}/r/skiper${number}.json`,
    dependencies: item.dependencies,
    registryDependencies: [],
    files: [{ path: `components/v1/${id}.tsx`, type: "registry:component", target: `@components/skipper-ui/${id}.tsx` }],
    assets: item.meta.assets,
    sourceId: id,
    upstreamUrl: item.meta.upstreamUrl,
  });
}

if (items.length !== 106) throw new Error(`Expected 106 upstream items; generated ${items.length}`);
await fs.writeFile(path.join(output, "index.json"), `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "Skipper UI for Free", homepage: siteUrl, items }, null, 2)}\n`);
console.log(`Generated ${items.length} registry items and public/r/index.json (${siteUrl}).`);

