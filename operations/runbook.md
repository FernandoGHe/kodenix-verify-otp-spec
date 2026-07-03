# Runbook Operativo

## WhatsApp caído

1. Verificar provider health.
2. Activar fallback automático a SMS si no está activo.
3. Confirmar que licencias permitan SMS.
4. Monitorear `otp_fallback_sent_total`.
5. Notificar clientes si el error rate supera SLA.

## Cuota agotada

1. Confirmar `LICENSE_OVER_QUOTA`.
2. Revisar consumo por licencia.
3. Ofrecer ampliación de cuota.
4. Reactivar si se actualiza quotaPolicy.

## URL no autorizada

1. Ver evento `LICENSE_ORIGIN_NOT_ALLOWED`.
2. Confirmar origin recibido.
3. Crear licencia/entitlement si procede comercialmente.
4. No recomendar wildcard amplio sin aprobación.
