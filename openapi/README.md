# OpenAPI Catalog

Contratos OpenAPI 3.x de Kodenix Verify OTP.

## Vista Swagger

- [Swagger UI](../swagger-ui/index.html)

## Contratos disponibles

| Contrato | Archivo | Responsabilidad |
|---|---|---|
| OTP Public API | [otp-public-api.yaml](otp-public-api.yaml) | Operación OTP usada por SDKs e integradores. |
| Licensing API | [licensing-api.yaml](licensing-api.yaml) | Licencias, entitlements, cuotas y control de uso. |
| Admin API | [admin-api.yaml](admin-api.yaml) | Administración de clientes, aplicaciones, reglas, branding y proveedores. |
| Provider Internal API | [provider-internal-api.yaml](provider-internal-api.yaml) | Contrato interno para orquestar WhatsApp, SMS y Email. |
| Analytics API | [analytics-api.yaml](analytics-api.yaml) | Métricas, uso, consumo y reportes transaccionales. |
| Webhooks API | [webhooks-api.yaml](webhooks-api.yaml) | Eventos enviados al backend del cliente. |

## Criterios comunes

- Formato: OpenAPI 3.x.
- Autenticación pública server-to-server: API Key.
- Autenticación SDK runtime: Bearer sdkToken temporal.
- Respuestas de error: formato normalizado definido en [Catálogo de errores](../docs/12-error-catalog.md).
- Conteo transaccional: definido en [Transaction Counting & Billing](../docs/04-transaction-counting-and-billing.md).
- Licenciamiento: definido en [Licensing & Usage Control](../docs/03-licensing-and-usage-control.md).
