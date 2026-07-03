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
