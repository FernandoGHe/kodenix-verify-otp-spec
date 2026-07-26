# 07 - API Contract Overview

## Cliente móvil Android

Android usa Bearer `sdkToken` para GET `/v1/otp/config`, PATCH `/v1/otp/target` y POST `/v1/otp/send`, `/resend`, `/verify`, `/cancel`. Envía internamente Platform, Package-Name, Certificate-Sha256, Environment y Sdk-Version. El OpenAPI actual solo declara explícitamente los dos primeros; los tres restantes son una discrepancia contractual pendiente.

## Swagger incluido

Este paquete incluye los siguientes contratos OpenAPI:

| Archivo | Propósito |
|---|---|
| `openapi/otp-public-api.yaml` | API pública consumida por backend cliente y SDK |
| `openapi/admin-api.yaml` | Administración de clientes, apps, reglas y branding |
| `openapi/licensing-api.yaml` | Licencias, entitlements, cuotas y uso |
| `openapi/provider-internal-api.yaml` | Contrato interno para proveedores/canales |
| `openapi/analytics-api.yaml` | Métricas, consumo y reportes |
| `openapi/webhooks-api.yaml` | Eventos enviados al cliente |

## Endpoints públicos principales

```text
POST /v1/otp/operations
GET  /v1/otp/config
POST /v1/otp/send
POST /v1/otp/verify
POST /v1/otp/resend
POST /v1/otp/cancel
GET  /v1/otp/status/{operationId}
GET  /v1/otp/events/{operationId}
```

## Endpoints de licencia principales

```text
POST /v1/admin/licenses
GET  /v1/admin/licenses/{licenseId}
PUT  /v1/admin/licenses/{licenseId}
POST /v1/admin/licenses/{licenseId}/suspend
POST /v1/admin/licenses/{licenseId}/reactivate
POST /v1/admin/licenses/{licenseId}/rotate
GET  /v1/admin/licenses/{licenseId}/usage
POST /v1/licenses/validate
```

## Errores comunes en todas las APIs

Todas las respuestas de error usan:

```json
{
  "success": false,
  "error": {
    "code": "LICENSE_ORIGIN_NOT_ALLOWED",
    "message": "El origen web no está autorizado para esta licencia.",
    "recoverable": false,
    "action": "CREATE_OR_UPDATE_LICENSE_FOR_ORIGIN"
  }
}
```
