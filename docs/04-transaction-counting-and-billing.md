# 04 - Conteo de Transacciones y Facturación

## Principio comercial

La transacción facturable principal es el **OTP enviado**.

Una vez que Kodenix acepta una solicitud válida de envío y ejecuta el intento hacia proveedor o cola interna de envío, la transacción cuenta al 100%.

## Cuenta como transacción

| Caso | Cuenta | Motivo |
|---|---:|---|
| WhatsApp enviado a proveedor | Sí | Uso real de canal |
| SMS enviado a proveedor | Sí | Uso real de canal |
| Email enviado a proveedor | Sí | Uso real de canal |
| Número no tiene WhatsApp | Sí | La API intentó el envío |
| Número inexistente detectado por proveedor | Sí | Validación externa no depende de Kodenix |
| Teléfono apagado/no disponible | Sí | Entrega final no garantizada |
| Email rebota | Sí | Intento de envío ejecutado |
| Proveedor acepta y luego falla entrega | Sí | Intento consumido |
| Usuario no ingresa OTP | Sí | OTP fue enviado |
| OTP expirado | Sí | OTP fue enviado |
| OTP incorrecto | No nuevo envío | Solo intento de validación |
| Reenvío por mismo canal | Sí | Nuevo envío |
| Fallback WhatsApp a SMS | Sí, ambos si ambos se envían | Dos intentos de envío |
| Fallback SMS a Email | Sí, ambos si ambos se envían | Dos intentos de envío |

## No cuenta como transacción de envío

| Caso | Cuenta | Motivo |
|---|---:|---|
| Licencia inválida | No | Rechazo previo |
| Origen no autorizado | No | Rechazo previo |
| Payload inválido | No | Rechazo previo |
| Falta target para canal | No | No se envía |
| Canal no permitido por licencia | No | No se envía |
| Cuota agotada antes de envío | No | No se envía |
| Rate limit antes de envío | No | No se envía |
| Consulta de estado | No como OTP sent | Puede contar como API call |
| Validación de OTP | No como OTP sent | Puede contar como verification attempt |

## Métricas separadas

Se recomienda separar:

- `otp_sent_billable`: envíos facturables.
- `otp_verify_attempt`: intentos de validación.
- `otp_verified_success`: validaciones exitosas.
- `otp_provider_failed`: fallas de proveedor.
- `otp_delivery_failed`: fallas de entrega.
- `otp_fallback_sent`: envíos por fallback.
- `api_call_total`: llamadas API generales.

## Fórmula base

```text
Total facturable = count(otp_sent_billable)
```

Por canal:

```text
Total WhatsApp = count(otp_sent_billable where channel = whatsapp)
Total SMS      = count(otp_sent_billable where channel = sms)
Total Email    = count(otp_sent_billable where channel = email)
```

## Evento contable

El evento que dispara conteo debe ser:

```text
OTP_SEND_ACCEPTED
```

No esperar a `DELIVERED`, porque muchos proveedores reportan entrega de forma asíncrona o incompleta.

## Payload de uso

```json
{
  "usageEventId": "usage_123",
  "type": "otp_sent_billable",
  "clientId": "client_001",
  "applicationId": "app_001",
  "licenseId": "lic_001",
  "operationId": "otp_op_123",
  "challengeId": "otp_ch_456",
  "channel": "whatsapp",
  "provider": "meta_whatsapp",
  "billable": true,
  "reason": "SEND_ACCEPTED",
  "createdAt": "2026-07-03T18:30:00Z"
}
```

## Fallback y doble conteo legítimo

Si WhatsApp es el canal primario y falla, puede ocurrir:

1. WhatsApp enviado: cuenta 1.
2. Proveedor responde que el usuario no tiene WhatsApp o falla entrega.
3. Sistema envía SMS como fallback: cuenta 1 adicional.

Total: 2 transacciones facturables.

## Respuesta visible al cliente

La API debe indicar claramente:

```json
{
  "success": true,
  "billable": true,
  "billingEventId": "usage_123",
  "billingPolicy": "COUNT_ON_SEND_ACCEPTED"
}
```
