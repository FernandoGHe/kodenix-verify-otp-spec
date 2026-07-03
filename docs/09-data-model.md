# 09 - Modelo de Datos

## Entidades principales

- Client
- Application
- Environment
- License
- LicenseEntitlement
- QuotaPolicy
- UsageEvent
- OtpOperation
- OtpChallenge
- OtpAttempt
- OtpEvent
- ProviderConfig
- WebhookConfig

## Nuevas entidades de licencia

### License

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | ID licencia |
| clientId | string | Cliente |
| applicationId | string | Aplicación |
| environment | string | Ambiente |
| status | enum | ACTIVE/TRIAL/etc |
| validFrom | datetime | Inicio vigencia |
| validUntil | datetime | Fin vigencia |
| billingModel | enum | OTP_SENT |

### LicenseEntitlement

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | ID entitlement |
| licenseId | string | Licencia |
| platform | enum | web/android/ios |
| allowedOrigins | string[] | URLs autorizadas |
| allowedPackageNames | string[] | Android |
| allowedBundleIds | string[] | iOS |
| allowedChannels | string[] | Canales permitidos |

### UsageEvent

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | ID evento |
| licenseId | string | Licencia |
| operationId | string | Operación |
| challengeId | string | Challenge |
| type | string | otp_sent_billable |
| channel | string | whatsapp/sms/email |
| billable | boolean | Facturable |
| reason | string | SEND_ACCEPTED |
| createdAt | datetime | Fecha |

Ver `diagrams/erd-licensing.mmd`.
