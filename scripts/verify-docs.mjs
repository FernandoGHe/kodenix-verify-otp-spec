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
for (const symbol of ["create", "MockOtpScenario", "mockEnabled", "loadConfiguration", "updateTarget", "send", "resend", "verify", "cancel", "OtpRequest", "KodenixOtpActivity", "KodenixOtpScreen"])
  requireText(guide, new RegExp(`\\b${symbol}\\b`), `símbolo público ${symbol}`);
for (const concept of ["operationId", "sdkToken", "PRODUCTION", "transporte\\s+HTTP", "X-Kodenix-Package-Name", "X-Kodenix-Certificate-Sha256", "X-Kodenix-Environment", "X-Kodenix-Sdk-Version", "X-Kodenix-Platform", "DRAFT"])
  requireText(guide, new RegExp(concept, "i"), concept);
for (const concept of ["REQUEST_PHONE", "REQUEST_EMAIL", "CORRECT_PHONE", "CORRECT_EMAIL", "getPreferredChannel", "2468", "captura interna"])
  requireText(guide, new RegExp(concept, "i"), `targets/canales: ${concept}`);
for (const concept of ["dependencias transitivas", "dependencia mínima", "Views y coroutines", "misma versión", "otp-core-ktx.*otp-core", "otp-ui-compose.*otp-core-ktx"])
  requireText(guide, new RegExp(concept, "is"), `instalación: ${concept}`);
for (const concept of ["argumentos posicionales", "ActivityResultContracts", "startActivityForResult", "123456", "2468", "Java legacy", "Views/XML"])
  requireText(guide, new RegExp(concept, "i"), `integración Android: ${concept}`);
for (const concept of ["OtpStatus", "OtpErrorCode", "OtpErrorAction", "OtpStatus.VERIFIED", "OtpErrorAction.CORRECT_PHONE", "no garantiza", "DELIVERY_FAILED", "webhook"])
  requireText(guide, new RegExp(concept.replaceAll(".", "\\."), "is"), `contrato tipado: ${concept}`);
if (/getStringExtra\s*\(\s*KodenixOtpResult\.EXTRA_STATUS/.test(read(guide))) failures.push(`${guide}: compara estado wire en vez de KodenixOtpResult.getStatus`);
if (/\bcreateMock\s*\(/.test(read(guide))) failures.push(`${guide}: inicializador mock separado ya no es API pública`);

for (const file of ["README.md", "MANIFEST.md", guide, "sdk/sdk-android-contract.md"])
  if (/https:\/\/github\.com\/[^\s)"']*android/i.test(read(file))) failures.push(`${file}: enlaza al repositorio Android privado`);

for (const file of walk(root).filter(item => item.endsWith(".md") && !item.includes(`${path.sep}node_modules${path.sep}`))) {
  if (/[ÃÂ]|â(?:€|™|œ|ž|–|—)/.test(fs.readFileSync(file, "utf8"))) failures.push(`${path.relative(root, file)}: contiene posible mojibake; guardar/corregir como UTF-8`);
}

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
  const dependencyGraph = {
    "otp-core-ktx": /api\s*\(\s*project\(\s*["']:\s*otp-core["']\s*\)\s*\)/,
    "otp-ui-views": /api\s*\(\s*project\(\s*["']:\s*otp-core["']\s*\)\s*\)/,
    "otp-ui-compose": /api\s*\(\s*project\(\s*["']:\s*otp-core-ktx["']\s*\)\s*\)/,
  };
  for (const [module, pattern] of Object.entries(dependencyGraph)) {
    if (!pattern.test(androidRead(`${module}/build.gradle.kts`))) failures.push(`${module}: cambió la dependencia transitiva documentada`);
  }
  if (/otp-core-ktx/.test(androidRead("otp-ui-views/build.gradle.kts"))) failures.push("otp-ui-views: ahora incluye KTX; revise la guía");
  const api = [
    "otp-core/src/main/java/com/kodenix/verify/otp/api/KodenixOtp.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/KodenixOtpClient.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/MockOtpScenario.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/OtpTarget.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/KodenixOtpConfiguration.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/OtpStatus.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/OtpErrorCode.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/OtpErrorAction.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/OtpError.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/OtpSendResult.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/OtpVerificationResult.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/api/OtpOperationStatus.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/internal/MockKodenixOtpClient.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/internal/HttpKodenixOtpClient.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/internal/AndroidAppIdentity.java",
    "otp-core/src/main/java/com/kodenix/verify/otp/internal/UrlConnectionOtpTransport.java",
    "otp-core-ktx/src/main/java/com/kodenix/verify/otp/ktx/OtpExtensions.kt",
    "otp-ui-views/src/main/java/com/kodenix/verify/otp/ui/views/KodenixOtpActivity.java",
    "otp-ui-views/src/main/java/com/kodenix/verify/otp/ui/views/KodenixOtpResult.java",
    "otp-ui-compose/src/main/java/com/kodenix/verify/otp/ui/compose/KodenixOtpScreen.kt",
  ].map(androidRead).join("\n");
  for (const symbol of ["create", "isMockEnabled", "loadConfiguration", "updateTarget", "send", "resend", "verify", "cancel", "createIntent", "KodenixOtpScreen"])
    if (!api.includes(`${symbol}(`)) failures.push(`API pública Android: no existe ${symbol}`);
  if (/static\s+KodenixOtpClient\s+createMock\s*\(/.test(api)) failures.push("API Android: createMock(...) reapareció; revise la guía");
  for (const behavior of ["REQUEST_PHONE", "REQUEST_EMAIL", "CORRECT_PHONE", "CORRECT_EMAIL", "getPreferredChannel"])
    if (!api.includes(behavior)) failures.push(`API pública Android: falta comportamiento ${behavior}`);
  for (const header of ["X-Kodenix-Platform", "X-Kodenix-Package-Name", "X-Kodenix-Certificate-Sha256", "X-Kodenix-Environment", "X-Kodenix-Sdk-Version"])
    if (!api.includes(header)) failures.push(`Transporte Android: falta header ${header}`);
  for (const enumName of ["OtpStatus", "OtpErrorCode", "OtpErrorAction"])
    if (!api.includes(`enum ${enumName}`)) failures.push(`API Android: falta enum ${enumName}`);
}

const otpOpenApi = read("openapi/otp-public-api.yaml");
for (const schema of ["OtpStatus", "OtpErrorCode", "OtpErrorAction", "ErrorResponse"])
  if (!new RegExp(`^    ${schema}:`, "m").test(otpOpenApi)) failures.push(`OpenAPI OTP: falta schema ${schema}`);
for (const header of ["X-Kodenix-Platform", "X-Kodenix-Package-Name", "X-Kodenix-Certificate-Sha256", "X-Kodenix-Environment", "X-Kodenix-Sdk-Version"])
  if (!otpOpenApi.includes(`name: ${header}`)) failures.push(`OpenAPI OTP: falta header ${header}`);
for (const forbidden of [/status:\s*\{\s*type:\s*string\s*,\s*example:\s*(?:SENT|VERIFIED)/, /^\s{8}(?:code|action):\s*\{\s*type:\s*string\s*\}/m])
  if (forbidden.test(otpOpenApi)) failures.push("OpenAPI OTP: status/code/action OTP sin enum explícito");
requireText("swagger-ui/index.html", /\.model-title[\s\S]*\.prop-type[\s\S]*\.opblock-summary-path/, "contraste oscuro de modelos y rutas Swagger");
for (const selector of [".opblock-section-header", ".parameters-container", ".responses-wrapper", ".highlight-code"]) {
  requireText("swagger-ui/index.html", new RegExp(selector.replaceAll(".", "\\.")), `contraste oscuro Swagger: ${selector}`);
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
