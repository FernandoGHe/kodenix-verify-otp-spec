# 13 - Webhooks

## Eventos

- otp.sent
- otp.delivery_failed
- otp.fallback_sent
- otp.verified
- otp.expired
- otp.blocked
- otp.cancelled
- license.over_quota
- provider.outage_detected

## Payload base

```json
{
  "id": "wh_evt_123",
  "type": "otp.fallback_sent",
  "clientId": "client_001",
  "applicationId": "app_001",
  "licenseId": "lic_001",
  "operationId": "otp_op_123",
  "createdAt": "2026-07-03T18:30:00Z",
  "data": {
    "fromChannel": "whatsapp",
    "toChannel": "sms",
    "reason": "WHATSAPP_PROVIDER_UNAVAILABLE",
    "billable": true
  }
}
```

## Firma

```http
X-Kodenix-Timestamp: 1783123456
X-Kodenix-Signature: sha256=...
```

## Entrega asíncrona OTP

```json
{
  "id": "wh_evt_456",
  "type": "otp.delivery_failed",
  "operationId": "op_123",
  "createdAt": "2026-07-25T20:00:00Z",
  "data": {
    "challengeId": "challenge_456",
    "status": "DELIVERY_FAILED",
    "channel": "whatsapp",
    "error": {
      "code": "OTP_PHONE_NOT_REGISTERED",
      "message": "El teléfono no está registrado en WhatsApp",
      "recoverable": true,
      "action": "CHOOSE_ANOTHER_CHANNEL"
    },
    "occurredAt": "2026-07-25T20:00:00Z"
  }
}
```

El receptor deduplica por `X-Kodenix-Event-Id`/`id`, verifica timestamp y firma sobre el body crudo antes de procesar, y responde 2xx solo cuando acepta el evento. Los reintentos pueden duplicar eventos. El consumidor debe tolerar llegada fuera de orden usando `occurredAt` y no retroceder un estado terminal por un evento más antiguo.

La política exacta de backoff, ventana máxima de reintentos y garantía formal de orden aún requiere definición backend. Hasta fijarla, no se promete entrega exactamente una vez ni orden global. La aplicación móvil no consulta endpoints privados; el backend integrador recibe estos cambios.
