# Database Model

Tablas recomendadas:

- clients
- applications
- licenses
- license_entitlements
- quota_policies
- usage_events
- otp_operations
- otp_challenges
- otp_attempts
- otp_events
- provider_configs
- provider_health_snapshots
- webhook_configs

## Índices críticos

```sql
CREATE INDEX idx_license_client_app_env ON licenses(client_id, application_id, environment);
CREATE INDEX idx_usage_license_created ON usage_events(license_id, created_at);
CREATE INDEX idx_otp_operation_license ON otp_operations(license_id, created_at);
CREATE INDEX idx_otp_challenge_operation ON otp_challenges(operation_id);
CREATE INDEX idx_otp_events_operation ON otp_events(operation_id, created_at);
```

## Particionado

Para >1M OTP/mes, particionar `usage_events` y `otp_events` por mes.
