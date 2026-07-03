# Backend Handoff

## Prioridad de implementación

1. Modelo Client/Application/License/Entitlement/Quota.
2. Middleware de autenticación API key y SDK token.
3. Validación de licencia por origen/app/plataforma/canal.
4. Crear operación OTP.
5. Config runtime SDK.
6. Send OTP con billing `COUNT_ON_SEND_ACCEPTED`.
7. Verify OTP.
8. Fallback WhatsApp → SMS → Email con target opcional.
9. Usage events y reportes.
10. Webhooks y auditoría.

## Regla crítica

No enviar OTP hasta que licencia, cuota, canal, origen/app y target estén validados.

## Conteo

Crear `UsageEvent` justo cuando el envío es aceptado por Kodenix para proveedor/cola. No esperar delivered.
