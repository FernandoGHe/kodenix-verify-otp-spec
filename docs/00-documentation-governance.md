# 00 - Gobierno de Documentación

## Propósito

Este documento define la fuente oficial de cada tema del paquete Kodenix Verify OTP SDK/API.

## Separación documental

Cada tema técnico o de negocio tiene un documento propietario. Otros documentos pueden referenciarlo de forma resumida.

| Tema | Documento propietario |
|---|---|
| Alcance funcional y límites MVP | `docs/01-functional-scope.md` |
| Requerimientos funcionales/no funcionales | `docs/02-requirements.md` |
| Licencias, entitlements, URL/package/bundle | `docs/03-licensing-and-usage-control.md` |
| Conteo transaccional y facturación | `docs/04-transaction-counting-and-billing.md` |
| Seguridad, tokens, secretos, replay, PII | `docs/05-security-specification.md` |
| Fallback, proveedor caído, target faltante | `docs/06-fallback-and-channel-availability.md` |
| Contrato API y mapa de Swagger | `docs/07-api-contract-overview.md` |
| Estados de operación OTP | `docs/08-state-machine.md` |
| Modelo de datos | `docs/09-data-model.md` |
| Servidores, sizing e infraestructura | `docs/10-infrastructure-sizing.md` |
| Observabilidad, auditoría y métricas | `docs/11-observability-audit.md` |
| Códigos de error | `docs/12-error-catalog.md` |
| Webhooks | `docs/13-webhooks.md` |
| SLA y disponibilidad | `docs/14-sla-and-availability.md` |
| Versionado y releases | `docs/15-release-versioning.md` |
| Superficie publicada | `docs/16-published-documentation-surface.md` |
| Integración completa del SDK Android | `docs/android/getting-started.md` |

## Propiedad de cambios

| Cambio | Documento propietario | Contratos relacionados |
|---|---|---|
| Regla comercial de cobro | `docs/04-transaction-counting-and-billing.md` | `openapi/analytics-api.yaml`, `openapi/licensing-api.yaml` |
| Regla de licencia o autorización de URL/app | `docs/03-licensing-and-usage-control.md` | `openapi/licensing-api.yaml` |
| Flujo de fallback | `docs/06-fallback-and-channel-availability.md` | `diagrams/sequence-provider-fallback.mmd`, QA |
| Código de error | `docs/12-error-catalog.md` | OpenAPI que exponga el error |
| Endpoint | OpenAPI correspondiente | `docs/07-api-contract-overview.md` |
| API pública de un SDK | Implementación de plataformas afectadas | `sdk/`, OpenAPI, guía de integración, ejemplos, pruebas, changelog y versión |

## Salida HTML

Los Markdown son la fuente oficial. `docs-html/` es una salida generada y no debe
editarse manualmente. Se regenera con `npm run docs:build` y se verifica con
`npm run docs:check`.

## Sincronización con SDK independientes

Los SDK Android, iOS y Web mantienen repositorios, versiones y releases
independientes; no se usan submódulos. Después de cambiar la API pública o publicar
un SDK debe abrirse una tarea separada para actualizar contratos, OpenAPI, guía de
integración, ejemplos, pruebas documentales, changelog y navegación.

Para Android, `npm run docs:check` funciona sin checkout del SDK y valida la
coherencia interna. Si se define `KODENIX_ANDROID_SDK_PATH`, también contrasta la
documentación con los archivos Gradle y la API pública de ese checkout local.
