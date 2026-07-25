# Published Documentation Surface

Superficie de publicación del paquete Kodenix Verify OTP.

## Entradas principales

| Recurso | Archivo | Propósito |
|---|---|---|
| Landing | `index.html` | Portada HTML para navegación ejecutiva y técnica. |
| README | `README.md` | Índice general del repositorio. |
| Manifest | `MANIFEST.md` | Inventario completo del paquete. |
| Swagger UI | `swagger-ui/index.html` | Vista visual de los contratos OpenAPI. |
| Diagramas | `diagrams/README.md` | Vista consolidada de diagramas Mermaid. |
| Integración Android | `docs/android/getting-started.md` | Guía completa para integradores Android. |

## Superficie funcional

| Área | Entrada |
|---|---|
| Alcance y requerimientos | [docs/01-functional-scope.md](01-functional-scope.md), [docs/02-requirements.md](02-requirements.md) |
| Licencias y uso | [docs/03-licensing-and-usage-control.md](03-licensing-and-usage-control.md) |
| Facturación transaccional | [docs/04-transaction-counting-and-billing.md](04-transaction-counting-and-billing.md) |
| Seguridad | [docs/05-security-specification.md](05-security-specification.md) |
| Fallback y disponibilidad | [docs/06-fallback-and-channel-availability.md](06-fallback-and-channel-availability.md) |
| Errores | [docs/12-error-catalog.md](12-error-catalog.md) |
| APIs | [openapi/README.md](../openapi/README.md) |
| SDKs | [sdk/sdk-contract-common.md](../sdk/sdk-contract-common.md) |
| Android | [docs/android/getting-started.md](android/getting-started.md) |
| Operación | [operations/runbook.md](../operations/runbook.md) |
| QA | [qa/test-cases.md](../qa/test-cases.md) |

## Generación

`npm run docs:build` transforma las fuentes Markdown en `docs-html/` y reconstruye
la navegación. `npm run docs:check` valida que esa salida esté sincronizada y que
la guía Android refleje las coordenadas Gradle y la API pública esencial.
