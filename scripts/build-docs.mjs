import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const outputRoot = path.join(root, "docs-html");
const assetsRoot = path.join(outputRoot, "assets");
const sourceRoots = ["README.md", "MANIFEST.md", "docs", "sdk", "openapi", "backend", "admin", "operations", "qa", "swagger-ui/README.md", "diagrams/README.md"];

function collect(entry) {
  const absolute = path.join(root, entry);
  if (!fs.existsSync(absolute)) return [];
  if (fs.statSync(absolute).isFile()) return entry.endsWith(".md") ? [entry] : [];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap(item =>
    collect(path.join(entry, item.name))
  );
}

const sources = sourceRoots.flatMap(collect).sort((a, b) => a.localeCompare(b));
const documents = sources.map(source => {
  const markdown = fs.readFileSync(path.join(root, source), "utf8");
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1] ?? path.basename(source, ".md");
  const target = path.join(source.replace(/\.md$/i, ""), "index.html");
  return { source, markdown, heading, target };
});

const buildHash = crypto.createHash("sha256");
for (const doc of documents) buildHash.update(doc.source).update("\0").update(doc.markdown).update("\0");
for (const source of ["index.html", "swagger-ui/index.html", "docs-html/assets/docs.css", "docs-html/assets/docs.js"]) {
  buildHash.update(source).update("\0").update(fs.readFileSync(path.join(root, source))).update("\0");
}
const buildVersion = buildHash.digest("hex").slice(0, 12);
const cssAsset = `docs.${buildVersion}.css`;
const jsAsset = `docs.${buildVersion}.js`;

fs.copyFileSync(path.join(assetsRoot, "docs.css"), path.join(assetsRoot, cssAsset));
fs.copyFileSync(path.join(assetsRoot, "docs.js"), path.join(assetsRoot, jsAsset));
fs.writeFileSync(path.join(root, "version.json"), `${JSON.stringify({ version: buildVersion })}\n`, "utf8");

function relativeUrl(fromTarget, toTarget) {
  const value = path.relative(path.dirname(fromTarget), path.dirname(toTarget)).replaceAll("\\", "/");
  return `${value || "."}/`;
}

function externalRelativeUrl(fromTarget, externalTarget) {
  const from = path.join("docs-html", fromTarget);
  return path.relative(path.dirname(from), externalTarget).replaceAll("\\", "/").replace(/index\.html$/, "");
}

function renderNavigation(current) {
  let lastSection = "";
  return documents.map(doc => {
    const section = doc.source.includes(path.sep) ? doc.source.split(/[\\/]/)[0] : "Principal";
    const sectionHtml = section !== lastSection ? `<div class="nav-section">${section}</div>` : "";
    lastSection = section;
    const active = doc.target === current ? " active" : "";
    return `${sectionHtml}<a class="nav-link${active}" href="${relativeUrl(current, doc.target)}">${escapeHtml(doc.heading)}</a>`;
  }).join("\n");
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

for (const doc of documents) {
  const legacyTarget = path.join(outputRoot, doc.source.replace(/\.md$/i, ".html"));
  if (fs.existsSync(legacyTarget)) fs.rmSync(legacyTarget);
  const landing = externalRelativeUrl(doc.target, "index.html");
  const swagger = externalRelativeUrl(doc.target, "swagger-ui/index.html");
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(doc.heading)} · Kodenix Verify</title><meta name="docs-version" content="${buildVersion}" /><link rel="stylesheet" href="${relativeUrl(doc.target, `assets/${cssAsset}`)}${cssAsset}" /></head>
<body><div class="layout"><aside class="sidebar"><a class="brand" href="${landing}"><span class="mark"></span><span><strong>Kodenix Verify</strong><span>OTP Documentation</span></span></a><div class="nav-list">
${renderNavigation(doc.target)}
</div></aside><main class="content"><article class="doc"><div class="top-actions"><a class="btn" href="${landing}">Landing</a><a class="btn" href="${swagger}">Swagger UI</a></div><div class="crumb">${escapeHtml(doc.source.replaceAll("\\", "/"))}</div>
${marked.parse(doc.markdown)}
</article></main></div><script src="${relativeUrl(doc.target, `assets/${jsAsset}`)}${jsAsset}"></script></body></html>\n`;
  const target = path.join(outputRoot, doc.target);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, "utf8");
}

for (const htmlFile of walkHtml(outputRoot)) {
  if (path.basename(htmlFile).toLowerCase() !== "index.html") {
    const alias = path.join(path.dirname(htmlFile), path.basename(htmlFile, ".html"), "index.html");
    fs.mkdirSync(path.dirname(alias), { recursive: true });
    fs.copyFileSync(htmlFile, alias);
  }
}

for (const htmlFile of walkHtml(outputRoot)) {
  const original = fs.readFileSync(htmlFile, "utf8");
  const clean = original
  .replace(/docs(?:\.[a-f0-9]{12})?\.css/g, cssAsset)
  .replace(/docs(?:\.[a-f0-9]{12})?\.js/g, jsAsset)
  .replace(
    /href=(['"])([^'"?#]*\/)?([^/'"?#]+)\.html([?#][^'"]*)?\1/gi,
    (_match, quote, prefix = "", page, suffix = "") =>
      `href=${quote}${prefix}${page.toLowerCase() === "index" ? "" : `${page}/`}${suffix}${quote}`,
  );
  if (clean !== original) fs.writeFileSync(htmlFile, clean, "utf8");
}

console.log(`Generated ${documents.length} HTML documents in docs-html/ (version ${buildVersion}).`);

function walkHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => {
    const file = path.join(directory, item.name);
    return item.isDirectory() ? walkHtml(file) : file.endsWith(".html") ? [file] : [];
  });
}
