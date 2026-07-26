# 01 - Alcance Funcional

## Objetivo

Kodenix Verify OTP es una plataforma OTP embebible compuesta por SDKs Web, Android e iOS, más un backend de orquestación. Permite integrar flujos OTP por WhatsApp, SMS y Email con UI configurable, reglas por cliente, licenciamiento, auditoría, conteo de consumo y fallback de canales.

Este documento define únicamente el alcance funcional. Las reglas detalladas de seguridad, licenciamiento, conteo transaccional, fallback, infraestructura y errores se documentan en sus secciones propietarias.

## Alcance MVP

- SDK Web con UI completa y modo headless.
- SDK Android con UI completa y modo headless.
- SDK iOS con UI completa y modo headless.
- Backend OTP multi-tenant.
- Canales: WhatsApp, SMS y Email.
- Configuración por cliente, aplicación, ambiente y licencia.
- Validación de origen Web, package Android y bundle iOS.
- Conteo transaccional por OTP enviado.
- Auditoría de eventos operativos, técnicos y comerciales.
- Webhooks para eventos relevantes.
- OpenAPI/Swagger para APIs públicas, administración, licencias, analytics, proveedores internos y webhooks.
- Portal administrativo para tenants, aplicaciones, licencias, reglas, branding, canales y consumo.

## Fuera de alcance MVP

- Biometría.
- Push approval.
- Magic links.
- Risk engine avanzado.
- Device fingerprint obligatorio.
- Facturación fiscal automatizada.
- Motor antifraude basado en scoring externo.
- Envío directo desde SDK hacia proveedores externos.

## Plataformas soportadas

| Plataforma | Modalidades |
|---|---|
| Web | UI completa, headless, configuración remota |
| Android | UI completa, headless, configuración remota |
| iOS | UI completa, headless, configuración remota |
| Backend cliente | Integración server-to-server para crear operación y consultar resultado |

## Canales soportados

| Canal | Uso esperado |
|---|---|
| WhatsApp | Canal primario configurable |
| SMS | Canal secundario configurable |
| Email | Canal terciario/configurable |

La prioridad y disponibilidad real dependen de reglas, licencia, cuotas, target disponible y salud de proveedores. Ver `docs/06-fallback-and-channel-availability.md`.

## Modos de inicialización SDK

El SDK puede iniciar con ambos datos, solo teléfono, solo email o sin target. El comportamiento exacto depende de `allowUserInput`, `allowTargetUpdate`, licencia, reglas y canales permitidos.

En Android 0.1.0 el mock valida el target por canal y las UIs respetan `preferredChannel`. La captura interna cuando no existe teléfono ni email continúa pendiente; no forma parte todavía del alcance funcional implementado.

| Modo | Target recibido | Resultado general |
|---|---|---|
| A | phone + email | Permite canales que usen teléfono y email según licencia |
| B | phone only | Permite WhatsApp/SMS; Email requiere captura autorizada |
| C | email only | Permite Email; WhatsApp/SMS requieren captura autorizada |
| D | none | Requiere captura autorizada o termina con error controlado |

La especificación detallada está en `docs/06-fallback-and-channel-availability.md` y `sdk/sdk-contract-common.md`.

## Modos de integración

### UI completa

El SDK presenta pantallas propias para captura de target, selección de canal, ingreso OTP, reenvío, éxito, error y cancelación, según configuración.

### Headless

El cliente usa su propia UI y consume métodos del SDK para crear sesión, enviar OTP, validar OTP, reenviar y consultar estado.

### Enterprise recomendado

El backend del cliente crea la operación contra Kodenix usando credenciales privadas. Kodenix valida licencia, app, ambiente y autorización de origen/app nativa. Después emite un `sdkToken` temporal para que el SDK continúe el flujo.

## Principales capacidades

- Crear operación OTP.
- Obtener configuración del SDK.
- Enviar OTP.
- Reenviar OTP.
- Validar OTP.
- Cambiar canal cuando esté permitido.
- Ejecutar fallback automático o manual.
- Cancelar flujo.
- Consultar estado.
- Emitir callbacks SDK.
- Emitir webhooks server-to-server.
- Registrar auditoría y consumo.
- Aplicar licencias, cuotas y entitlements.

## Referencias por tema

| Tema | Documento |
|---|---|
| Requerimientos | `docs/02-requirements.md` |
| Licenciamiento y control por URL/app | `docs/03-licensing-and-usage-control.md` |
| Cobro por OTP enviado | `docs/04-transaction-counting-and-billing.md` |
| Seguridad | `docs/05-security-specification.md` |
| Fallback y target opcional | `docs/06-fallback-and-channel-availability.md` |
| API/Swagger | `docs/07-api-contract-overview.md` y `openapi/` |
| Estados | `docs/08-state-machine.md` |
| Infraestructura | `docs/10-infrastructure-sizing.md` |
| Errores | `docs/12-error-catalog.md` |
| SDK | `sdk/` |
| QA | `qa/` |
