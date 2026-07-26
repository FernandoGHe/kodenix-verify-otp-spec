import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const requireText = (file, pattern, label) => {
  if (!pattern.test(read(file))) failures.push(`${file}: falta ${label}`);
};

for (const file of ["README.md", "MANIFEST.md", "docs/16-published-documentation-surface.md"])
  requireText(file, /android\/getting-started/, "enlace a la guía Android");

const guide = "docs/android/getting-started.md";
for (const artifact of ["otp-core", "otp-core-ktx", "otp-ui-views", "otp-ui-compose"])
  requireText(guide, new RegExp(`com\\.kodenix\\.verify:${artifact}:0\\.1\\.0`), `coordenada ${artifact}`);
for (const symbol of ["createMock", "MockOtpScenario", "loadConfiguration", "updateTarget", "send", "resend", "verify", "cancel", "OtpRequest", "KodenixOtpActivity", "KodenixOtpScreen", "onFinished"])
  requireText(guide, new RegExp(`\\b${symbol}\\b`), `símbolo público ${symbol}`);
for (const concept of ["operationId", "sdkToken", "PRODUCTION", "transporte\\s+HTTP", "pendiente", "X-Kodenix-Package-Name", "DRAFT"])
  requireText(guide, new RegExp(concept, "i"), concept);
for (const concept of ["REQUEST_PHONE", "REQUEST_EMAIL", "CORRECT_PHONE", "CORRECT_EMAIL", "getPreferredChannel", "2468", "captura interna"])
  requireText(guide, new RegExp(concept, "i"), `targets/canales: ${concept}`);

for (const file of ["README.md", "MANIFEST.md", guide, "sdk/sdk-android-contract.md"])
  if (/https:\/\/github\.com\/[^\s)"']*android/i.test(read(file))) failures.push(`${file}: enlaza al repositorio Android privado`);

const androidRoot = process.env.KODENIX_ANDROID_SDK_PATH;
if (androidRoot) {
  const androidRead = file => fs.readFileSync(path.join(androidRoot, file), "utf8");
  for (const module of ["otp-core", "otp-core-ktx", "otp-ui-views", "otp-ui-compose"]) {
    const build = androidRead(`${module}/build.gradle.kts`);
    const version = build.match(/version\s*=\s*"([^"]+)"/)?.[1];
    const artifact = build.match(/artifactId\s*=\s*"([^"]+)"/)?.[1];
    if (!version || !artifact) failures.push(`${module}: no se pudo leer artifact/version`);
    else requireText(guide, new RegExp(`com\\.kodenix\\.verify:${artifact}:${version.replaceAll(".", "\\.")}`), `coordenada vigente de ${module}`);
  }
  const api = [
    "otp-core/src/main/java/com/kodenix/verify/otp/api/KodenixOtp.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/KodenixOtpClient.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/MockOtpScenario.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/OtpTarget.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/internal/MockKodenixOtpClient.java",
    "otp-core-ktx/src/main/java/com/kodenix/verify/otp/ktx/OtpExtensions.kt",
    "otp-ui-views/src/main/java/com/kodenix/verify/otp/ui/views/KodenixOtpActivity.java",
    "otp-ui-compose/src/main/java/com/kodenix/verify/otp/ui/compose/KodenixOtpScreen.kt",
  ].map(androidRead).join("\n");
  for (const symbol of ["createMock", "loadConfiguration", "updateTarget", "send", "resend", "verify", "cancel", "createIntent", "KodenixOtpScreen"])
    if (!api.includes(`${symbol}(`)) failures.push(`API pública Android: no existe ${symbol}`);
  if (/static\s+KodenixOtpClient\s+create\s*\(/.test(api)) failures.push("API Android: revise la guía, create(...) ya existe");
  for (const behavior of ["REQUEST_PHONE", "REQUEST_EMAIL", "CORRECT_PHONE", "CORRECT_EMAIL", "getPreferredChannel"])
    if (!api.includes(behavior)) failures.push(`API pública Android: falta comportamiento ${behavior}`);
}

const before = new Map(walk(path.join(root, "docs-html")).map(file => [file, digest(file)]));
const build = spawnSync(process.execPath, [path.join(root, "scripts/build-docs.mjs")], { cwd: root, encoding: "utf8" });
if (build.status !== 0) failures.push(`generador HTML: ${build.stderr || build.stdout}`);
for (const file of walk(path.join(root, "docs-html"))) {
  if (before.has(file) && before.get(file) !== digest(file)) failures.push(`docs-html desactualizado: ${path.relative(root, file)}`);
  before.delete(file);
}
for (const file of before.keys()) failures.push(`docs-html faltante tras generar: ${path.relative(root, file)}`);

for (const file of [path.join(root, "README.md"), path.join(root, "index.html"), ...walk(path.join(root, "docs-html")).filter(f => f.endsWith(".html"))])
  if (/href=["'][^"']*\.html(?:[?#][^"']*)?["']/i.test(fs.readFileSync(file, "utf8"))) failures.push(`${path.relative(root, file)}: contiene ruta pública no limpia`);

const version = JSON.parse(read("version.json")).version;
if (!/^[a-f0-9]{12}$/.test(version)) failures.push("version.json: build inválido");
for (const extension of ["css", "js"])
  if (!fs.existsSync(path.join(root, `docs-html/assets/docs.${version}.${extension}`))) failures.push(`asset ${extension} versionado faltante`);
requireText("docs-html/assets/docs.js", /cache:\s*['"]no-store['"]/, "consulta de versión sin cache");

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Android docs, links and generated HTML are synchronized${androidRoot ? " with the local SDK" : " internally"}.`);

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => {
    const file = path.join(directory, item.name);
    return item.isDirectory() ? walk(file) : [file];
  });
}
function digest(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
