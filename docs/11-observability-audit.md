# 11 - Observabilidad y Auditoría

## Eventos de auditoría mínimos

- LICENSE_VALIDATION_REQUESTED
- LICENSE_VALIDATION_FAILED
- LICENSE_VALIDATION_SUCCESS
- SDK_CONFIG_REQUESTED
- OTP_OPERATION_CREATED
- OTP_TARGET_REQUIRED
- OTP_SEND_REQUESTED
- OTP_SEND_ACCEPTED
- OTP_SENT
- OTP_PROVIDER_UNAVAILABLE
- OTP_DELIVERY_FAILED
- OTP_FALLBACK_EVALUATING
- OTP_FALLBACK_TARGET_MISSING
- OTP_FALLBACK_SENT
- OTP_VERIFY_REQUESTED
- OTP_VERIFIED
- OTP_INVALID_ATTEMPT
- OTP_EXPIRED
- OTP_BLOCKED
- OTP_CANCELLED
- USAGE_EVENT_CREATED

## Métricas principales

- otp_sent_billable_total
- otp_sent_by_channel_total
- otp_verified_total
- otp_invalid_attempt_total
- otp_expired_total
- otp_fallback_used_total
- otp_fallback_target_missing_total
- provider_error_total
- license_rejected_total
- quota_rejected_total
- origin_rejected_total

## Alertas

| Alerta | Umbral inicial |
|---|---|
| WhatsApp provider error rate | > 5% en 5 min |
| SMS provider error rate | > 5% en 5 min |
| Email provider error rate | > 10% en 10 min |
| License rejected spike | > 100/min por cliente |
| OTP send latency p95 | > 2s |
| Queue depth | > 10k mensajes |
| Redis errors | cualquier spike |
| PostgreSQL CPU | > 80% 10 min |
