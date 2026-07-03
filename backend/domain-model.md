# Domain Model

Objetos dominio:

- LicenseValidator
- EntitlementMatcher
- QuotaService
- OtpOperationService
- OtpChallengeService
- OtpVerifier
- ProviderRouter
- FallbackEvaluator
- UsageRecorder
- AuditRecorder
- WebhookDispatcher

Regla de oro: `UsageRecorder.recordBillableSend()` debe ser idempotente por `challengeId + channel + providerMessageId`.
