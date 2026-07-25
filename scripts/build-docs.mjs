import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const root = path.resolve(import.meta.dirname, "..");
const outputRoot = path.join(root, "docs-html");
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
  const target = source.replace(/\.md$/i, ".html");
  return { source, markdown, heading, target };
});

function relativeUrl(fromTarget, toTarget) {
  const value = path.relative(path.dirname(fromTarget), toTarget).replaceAll("\\", "/");
  return value || path.basename(toTarget);
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
  const depth = doc.target.split(/[\\/]/).length - 1;
  const rootPrefix = "../".repeat(depth + 1);
  const css = relativeUrl(doc.target, "assets/docs.css");
  const js = relativeUrl(doc.target, "assets/docs.js");
  const landing = `${rootPrefix}index.html`;
  const swagger = `${rootPrefix}swagger-ui/index.html`;
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(doc.heading)} · Kodenix Verify</title><link rel="stylesheet" href="${css}" /></head>
<body><div class="layout"><aside class="sidebar"><a class="brand" href="${landing}"><span class="mark"></span><span><strong>Kodenix Verify</strong><span>OTP Documentation</span></span></a><div class="nav-list">
${renderNavigation(doc.target)}
</div></aside><main class="content"><article class="doc"><div class="top-actions"><a class="btn" href="${landing}">Landing</a><a class="btn" href="${swagger}">Swagger UI</a></div><div class="crumb">${escapeHtml(doc.source.replaceAll("\\", "/"))}</div>
${marked.parse(doc.markdown)}
</article></main></div><script src="${js}"></script></body></html>\n`;
  const target = path.join(outputRoot, doc.target);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, "utf8");
}

console.log(`Generated ${documents.length} HTML documents in docs-html/.`);
