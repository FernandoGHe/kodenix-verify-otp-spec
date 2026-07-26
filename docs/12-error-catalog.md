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

`LICENSE_PACKAGE_NOT_ALLOWED` indica que la combinación instalada de package y certificado SHA-256 no está autorizada; no debe resolverse con un bypass local.
| LICENSE_BUNDLE_NOT_ALLOWED | 403 | No | Autorizar bundle/team |
| LICENSE_CHANNEL_NOT_ALLOWED | 403 | No | Habilitar canal |
| LICENSE_ENVIRONMENT_NOT_ALLOWED | 403 | No | Usar un ambiente autorizado |

## Target / canal

| Código | HTTP | Recuperable | Acción |
|---|---:|---:|---|
| OTP_TARGET_REQUIRED | 400 | Sí | Pedir teléfono/email |

En el mock Android, `OTP_TARGET_REQUIRED` usa `REQUEST_PHONE` para WhatsApp/SMS y `REQUEST_EMAIL` para Email. `OTP_INVALID_PHONE` usa `CORRECT_PHONE`; `OTP_INVALID_EMAIL`, `CORRECT_EMAIL`.
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

## SDK y red

| Código | HTTP | Recuperable | Acción |
|---|---:|---:|---|
| SDK_INVALID_CONFIGURATION | — | No | Corregir ambiente o configuración |
| SDK_UNSUPPORTED_VERSION | 400/426 | No | Actualizar el SDK |
| SDK_REQUEST_CANCELLED | — | Sí | Decidir si iniciar otra solicitud |
| OTP_NETWORK_ERROR | —/504 | Sí | Recuperar conectividad; reintentar solo si es seguro |
| OTP_SDK_ERROR | — | Depende | Corregir configuración o actualizar el SDK |

Android entrega código, mensaje, recuperabilidad, acción, HTTP opcional y causa en `OtpError`. No deben mostrarse causas internas ni registrarse tokens, OTP o targets.
| OTP_OPERATION_NOT_FOUND | 404 | No | Crear operación |
