# Diagramas Mermaid

Vista consolidada de diagramas técnicos de Kodenix Verify OTP.

Los archivos `.mmd` se conservan como fuente editable y este documento mantiene los diagramas embebidos para navegación visual dentro del repositorio.

## Component

Fuente: [`component.mmd`](component.mmd)

```mermaid
flowchart LR
  App[App Cliente Web Android iOS] --> SDK[Kodenix OTP SDK]
  BackendCliente[Backend Cliente] --> OTPAPI[Kodenix OTP API]
  SDK --> OTPAPI
  OTPAPI --> Auth[Auth + License Middleware]
  Auth --> License[License Service]
  OTPAPI --> Rules[Rules Engine]
  OTPAPI --> Otp[OTP Service]
  Otp --> Redis[(Redis OTP/Rate Limit)]
  Otp --> DB[(PostgreSQL)]
  Otp --> Usage[Usage/Billing Service]
  Otp --> ProviderRouter[Provider Router]
  ProviderRouter --> WA[WhatsApp Provider]
  ProviderRouter --> SMS[SMS Provider]
  ProviderRouter --> Email[Email Provider]
  Usage --> DB
  OTPAPI --> Audit[Audit Service]
  Audit --> DB

```

## Deployment

Fuente: [`deployment.mmd`](deployment.mmd)

```mermaid
flowchart TB
  subgraph Client
    Web[Web App]
    Android[Android App]
    IOS[iOS App]
    SDK[OTP SDK]
  end
  subgraph Customer
    CBE[Backend Cliente]
  end
  subgraph KodenixCloud
    WAF[WAF / API Gateway]
    API[OTP API]
    ADMIN[Admin API]
    WORKER[Queue Workers]
    REDIS[(Redis HA)]
    PG[(PostgreSQL HA)]
    QUEUE[(Queue)]
    OBS[Logs Metrics Traces]
  end
  subgraph Providers
    Meta[Meta WhatsApp]
    Twilio[Twilio/Vonage SMS]
    SES[SES/SendGrid/Resend]
  end
  Web --> SDK
  Android --> SDK
  IOS --> SDK
  SDK --> WAF
  CBE --> WAF
  WAF --> API
  WAF --> ADMIN
  API --> REDIS
  API --> PG
  API --> QUEUE
  QUEUE --> WORKER
  WORKER --> Meta
  WORKER --> Twilio
  WORKER --> SES
  API --> OBS
  WORKER --> OBS

```

## Erd Licensing

Fuente: [`erd-licensing.mmd`](erd-licensing.mmd)

```mermaid
erDiagram
  CLIENT ||--o{ APPLICATION : owns
  APPLICATION ||--o{ LICENSE : has
  LICENSE ||--o{ LICENSE_ENTITLEMENT : grants
  LICENSE ||--|| QUOTA_POLICY : uses
  LICENSE ||--o{ USAGE_EVENT : records
  APPLICATION ||--o{ OTP_OPERATION : creates
  OTP_OPERATION ||--o{ OTP_CHALLENGE : has
  OTP_OPERATION ||--o{ OTP_ATTEMPT : has
  OTP_OPERATION ||--o{ OTP_EVENT : logs
  OTP_CHALLENGE ||--o{ USAGE_EVENT : bills

  CLIENT {
    string id
    string name
    string status
  }
  APPLICATION {
    string id
    string client_id
    string name
    string environment
  }
  LICENSE {
    string id
    string client_id
    string application_id
    string environment
    string status
    string billing_model
    datetime valid_from
    datetime valid_until
  }
  LICENSE_ENTITLEMENT {
    string id
    string license_id
    string platform
    string allowed_origins
    string allowed_packages
    string allowed_bundles
    string allowed_channels
  }
  QUOTA_POLICY {
    string id
    string license_id
    int monthly_otp_sent_limit
    int daily_otp_sent_limit
    boolean hard_limit
  }
  USAGE_EVENT {
    string id
    string license_id
    string operation_id
    string challenge_id
    string type
    string channel
    boolean billable
    string reason
    datetime created_at
  }
  OTP_OPERATION {
    string id
    string license_id
    string status
    string target_phone_masked
    string target_email_masked
    datetime created_at
  }
  OTP_CHALLENGE {
    string id
    string operation_id
    string channel
    string otp_hash
    string status
    datetime expires_at
  }
  OTP_ATTEMPT {
    string id
    string operation_id
    boolean success
    string failure_reason
  }
  OTP_EVENT {
    string id
    string operation_id
    string event_type
    string payload
  }

```

## Outage Flow

Fuente: [`outage-flow.mmd`](outage-flow.mmd)

```mermaid
flowchart TD
  A[Solicitud send OTP] --> B{Licencia válida?}
  B -- No --> X[Rechazar sin conteo]
  B -- Sí --> C{Canal primario healthy?}
  C -- Sí --> D[Enviar canal primario]
  D --> E[Crear usage billable]
  D --> F{Proveedor aceptó?}
  F -- Sí --> G[SENT]
  F -- No --> H[Evaluar fallback]
  C -- No --> H
  H --> I{Canal alterno permitido?}
  I -- No --> Y[OTP_NO_FALLBACK_AVAILABLE]
  I -- Sí --> J{Existe target alterno?}
  J -- No --> Z[OTP_FALLBACK_TARGET_MISSING]
  J -- Sí --> K[Enviar fallback]
  K --> L[Crear usage billable fallback]
  K --> M[SENT fallback]

```

## Security Token Flow

Fuente: [`security-token-flow.mmd`](security-token-flow.mmd)

```mermaid
sequenceDiagram
  participant BE as Backend Cliente
  participant API as Kodenix API
  participant LIC as License Service
  participant SDK as SDK

  BE->>API: POST /otp/operations with private API key
  API->>LIC: Validate license + origin/app entitlement
  LIC-->>API: Valid + allowed channels + quota
  API->>API: Issue short-lived sdkToken bound to operationId/licenseId
  API-->>BE: sdkToken
  BE-->>SDK: sdkToken
  SDK->>API: Bearer sdkToken
  API->>API: Validate token claims + request origin/app
  API-->>SDK: Runtime response

```

## Sequence Enterprise License

Fuente: [`sequence-enterprise-license.mmd`](sequence-enterprise-license.mmd)

```mermaid
sequenceDiagram
  participant App as App Cliente
  participant BE as Backend Cliente
  participant API as Kodenix OTP API
  participant LIC as License Service
  participant SDK as SDK
  participant PROV as Proveedor

  App->>BE: Solicita iniciar OTP
  BE->>API: POST /v1/otp/operations API Key + licenseId + origin/app
  API->>LIC: Validar licencia, origen/app, cuota, canal
  LIC-->>API: OK
  API-->>BE: operationId + sdkToken
  BE-->>App: operationId + sdkToken
  App->>SDK: start(operationId, sdkToken, target opcional)
  SDK->>API: GET /v1/otp/config
  API-->>SDK: Config + targetState + canales disponibles
  SDK->>API: POST /v1/otp/send channel=auto
  API->>LIC: Validar licencia/cuota antes de envío
  LIC-->>API: OK
  API->>API: Crear OTP_SEND_ACCEPTED + usage billable
  API->>PROV: Enviar WhatsApp
  PROV-->>API: Accepted/Sent
  API-->>SDK: SENT + billingEventId
  SDK->>API: POST /v1/otp/verify
  API-->>SDK: VERIFIED
  SDK-->>App: onSuccess
  App->>BE: Confirmar resultado
  BE->>API: GET /v1/otp/status/{operationId}
  API-->>BE: VERIFIED

```

## Sequence Provider Fallback

Fuente: [`sequence-provider-fallback.mmd`](sequence-provider-fallback.mmd)

```mermaid
sequenceDiagram
  participant SDK
  participant API as OTP API
  participant LIC as License Service
  participant WA as WhatsApp Provider
  participant SMS as SMS Provider
  participant EMAIL as Email Provider

  SDK->>API: POST /v1/otp/send channel=auto
  API->>LIC: Validar WhatsApp licencia/cuota/target phone
  LIC-->>API: OK
  API->>API: usage whatsapp billable on SEND_ACCEPTED
  API->>WA: send OTP
  WA-->>API: Failed/Unavailable
  API->>API: Evaluar fallback
  alt phone existe y SMS permitido
    API->>LIC: Validar SMS licencia/cuota
    LIC-->>API: OK
    API->>API: usage sms billable on SEND_ACCEPTED
    API->>SMS: send OTP
    SMS-->>API: Sent
    API-->>SDK: SENT by SMS fallback.used=true
  else falta phone o SMS no permitido
    alt email existe y Email permitido
      API->>LIC: Validar Email
      API->>EMAIL: send OTP
      EMAIL-->>API: Sent
      API-->>SDK: SENT by Email fallback.used=true
    else no existe target alterno
      API-->>SDK: OTP_FALLBACK_TARGET_MISSING
    end
  end

```

## Sequence Sdk Init Target Optional

Fuente: [`sequence-sdk-init-target-optional.mmd`](sequence-sdk-init-target-optional.mmd)

```mermaid
sequenceDiagram
  participant App as App
  participant SDK as SDK
  participant API as OTP API

  App->>SDK: start({operationId, sdkToken, target?})
  SDK->>API: GET /v1/otp/config
  API-->>SDK: targetState(hasPhone, hasEmail, allowUserInput)
  alt No target and allowUserInput=true
    SDK-->>App: Mostrar pantalla captura teléfono/email
    App->>SDK: Usuario captura target
    SDK->>API: PATCH /v1/otp/target
    API-->>SDK: target actualizado
  else No target and allowUserInput=false
    SDK-->>App: onError OTP_TARGET_REQUIRED
  else Target suficiente
    SDK->>API: POST /v1/otp/send
  end

```

## State Machine

Fuente: [`state-machine.mmd`](state-machine.mmd)

```mermaid
stateDiagram-v2
  [*] --> CREATED
  CREATED --> LICENSE_VALIDATING
  LICENSE_VALIDATING --> LICENSE_REJECTED: invalid origin/app/quota
  LICENSE_VALIDATING --> CONFIG_LOADED: valid
  CONFIG_LOADED --> PENDING_TARGET: missing target and input allowed
  PENDING_TARGET --> CONFIG_LOADED: target updated
  CONFIG_LOADED --> PENDING_DELIVERY: send requested
  PENDING_DELIVERY --> SEND_ACCEPTED: accepted for provider/queue
  SEND_ACCEPTED --> SENT: provider sent
  SEND_ACCEPTED --> FAILED_DELIVERY: provider failed
  SENT --> DELIVERED: provider callback optional
  FAILED_DELIVERY --> FALLBACK_EVALUATING
  FALLBACK_EVALUATING --> FALLBACK_IN_PROGRESS: alternate target/channel available
  FALLBACK_EVALUATING --> FAILED_DELIVERY: no fallback target/channel
  FALLBACK_IN_PROGRESS --> SEND_ACCEPTED: fallback send accepted
  SENT --> PENDING_VERIFICATION: user enters code
  DELIVERED --> PENDING_VERIFICATION
  PENDING_VERIFICATION --> VERIFIED: valid code
  PENDING_VERIFICATION --> INVALID_ATTEMPT: invalid code
  INVALID_ATTEMPT --> PENDING_VERIFICATION: attempts remain
  INVALID_ATTEMPT --> BLOCKED: max attempts
  SENT --> EXPIRED: ttl reached
  DELIVERED --> EXPIRED: ttl reached
  CREATED --> CANCELLED
  SENT --> CANCELLED
  VERIFIED --> [*]
  BLOCKED --> [*]
  EXPIRED --> [*]
  CANCELLED --> [*]
  LICENSE_REJECTED --> [*]

```

