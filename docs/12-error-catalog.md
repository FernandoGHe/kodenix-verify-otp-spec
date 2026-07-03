# 12 - Catálogo de Errores

## Licencia

| Código | HTTP | Recuperable | Acción |
|---|---:|---:|---|
| LICENSE_NOT_FOUND | 403 | No | Crear licencia |
| LICENSE_EXPIRED | 403 | No | Renovar licencia |
| LICENSE_SUSPENDED | 403 | No | Reactivar licencia |
| LICENSE_REVOKED | 403 | No | Emitir nueva licencia |
| LICENSE_OVER_QUOTA | 402/429 | No | Comprar/ampliar cuota |
| LICENSE_ORIGIN_NOT_ALLOWED | 403 | No | Crear licencia para URL |
| LICENSE_PACKAGE_NOT_ALLOWED | 403 | No | Autorizar package/fingerprint |
| LICENSE_BUNDLE_NOT_ALLOWED | 403 | No | Autorizar bundle/team |
| LICENSE_CHANNEL_NOT_ALLOWED | 403 | No | Habilitar canal |

## Target / canal

| Código | HTTP | Recuperable | Acción |
|---|---:|---:|---|
| OTP_TARGET_REQUIRED | 400 | Sí | Pedir teléfono/email |
| OTP_INVALID_PHONE | 400 | Sí | Corregir teléfono |
| OTP_INVALID_EMAIL | 400 | Sí | Corregir email |
| OTP_CHANNEL_NOT_AVAILABLE | 400 | Sí | Elegir otro canal |
| OTP_FALLBACK_TARGET_MISSING | 409 | Sí | Capturar target alterno |
| OTP_NO_FALLBACK_AVAILABLE | 409 | No | Terminar flujo o reintentar después |

## Envío/proveedor

| Código | HTTP | Recuperable | Acción |
|---|---:|---:|---|
| OTP_PROVIDER_UNAVAILABLE | 503 | Sí | Fallback o reintento |
| OTP_PROVIDER_TIMEOUT | 504 | Sí | Fallback o reintento |
| OTP_PROVIDER_AUTH_ERROR | 502 | No | Revisar credenciales proveedor |
| OTP_DELIVERY_FAILED | 502 | Sí | Fallback |
| OTP_SEND_RATE_LIMITED | 429 | Sí | Esperar cooldown |

## Validación

| Código | HTTP | Recuperable | Acción |
|---|---:|---:|---|
| OTP_INVALID_CODE | 200/400 | Sí | Reintentar |
| OTP_EXPIRED | 410 | Sí | Reenviar |
| OTP_MAX_ATTEMPTS_REACHED | 423 | No | Crear nueva operación |
| OTP_ALREADY_VERIFIED | 409 | No | Continuar flujo |
| OTP_OPERATION_NOT_FOUND | 404 | No | Crear operación |
