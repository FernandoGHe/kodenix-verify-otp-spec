# 03 - Licenciamiento y Control de Uso

## Objetivo

Evitar que un cliente use una API key o token en cualquier cantidad de sitios, apps o ambientes. Cada uso debe estar asociado a una licencia autorizada.

## Modelo jerárquico

```text
Client
  └── Application
        └── Environment
              └── License
                    ├── Platform entitlement
                    ├── Allowed origins / packages / bundles
                    ├── Allowed channels
                    ├── Quotas
                    ├── Billing policy
                    └── Status
```

## Entidades

### Client

Empresa contratante.

### Application

Producto o sistema del cliente. Ejemplo: `Banco Demo Onboarding`.

### Environment

`sandbox`, `qa`, `staging`, `production`.

### License

Contrato técnico que habilita uso del SDK/API para una app, ambiente, plataforma y orígenes específicos.

## Una URL, una licencia o entitlement explícito

Regla de negocio:

> Tener API key de cliente no permite usar el SDK en todos los sitios del cliente. Cada URL debe estar registrada y autorizada por licencia.

Ejemplo:

```json
{
  "licenseId": "lic_prod_web_001",
  "platform": "web",
  "allowedOrigins": [
    "https://onboarding.bancodemo.com"
  ]
}
```

Si el cliente quiere usar:

```text
https://creditos.bancodemo.com
```

debe crear otra licencia o agregar explícitamente otro entitlement, según política comercial.

## Validación por plataforma

### Web

Validar:

- `Origin` header.
- `Referer` como apoyo, no como fuente única de confianza.
- Dominio exacto o wildcard autorizado.
- Ambiente.
- sdkToken asociado a licenseId.

No permitir comodines amplios tipo:

```text
*.com
*.cliente.com  // solo permitir si comercial y seguridad lo aprueban
```

Preferido:

```text
https://onboarding.cliente.com
https://app.cliente.com
```

### Android

Validar:

- `packageName`.
- Signing certificate fingerprint SHA-256.
- Environment.
- SDK version mínima.

### iOS

Validar:

- `bundleId`.
- Apple Team ID, si aplica.
- Environment.
- SDK version mínima.

## Estados de licencia

| Estado | Descripción | Permite crear operación | Permite enviar OTP |
|---|---|---:|---:|
| TRIAL | Licencia de prueba | Sí | Sí, con límite |
| ACTIVE | Licencia vigente | Sí | Sí |
| SUSPENDED | Suspendida manualmente | No | No |
| EXPIRED | Vigencia terminada | No | No |
| REVOKED | Revocada por seguridad | No | No |
| OVER_QUOTA | Cuota agotada | Sí opcional | No |
| READ_ONLY | Solo consulta de estado/analytics | No | No |

## Políticas de cuota

- Mensual por licencia.
- Mensual por cliente.
- Diaria para protección de abuso.
- Por canal.
- Por ambiente.

Ejemplo:

```json
{
  "quotaPolicy": {
    "monthlyOtpSentLimit": 100000,
    "dailyOtpSentLimit": 10000,
    "whatsappMonthlyLimit": 70000,
    "smsMonthlyLimit": 25000,
    "emailMonthlyLimit": 5000,
    "hardLimit": true
  }
}
```

## Cuándo validar licencia

1. Al crear operación.
2. Al solicitar configuración del SDK.
3. Antes de enviar OTP.
4. Antes de reenviar OTP.
5. Antes de cambiar canal.
6. Al recibir webhooks internos de proveedor para asociar consumo.

## Flujo recomendado

1. Backend cliente llama `POST /v1/otp/operations` con API key privada.
2. Kodenix valida client/application/license/origin-package-bundle.
3. Kodenix emite `sdkToken` temporal ligado a `operationId` y `licenseId`.
4. SDK llama APIs con Bearer token.
5. Cada envío valida licencia y cuota antes de invocar proveedor.

## Errores de licencia

| Código | HTTP | Descripción |
|---|---:|---|
| LICENSE_NOT_FOUND | 403 | No existe licencia aplicable |
| LICENSE_EXPIRED | 403 | Licencia vencida |
| LICENSE_SUSPENDED | 403 | Licencia suspendida |
| LICENSE_REVOKED | 403 | Licencia revocada |
| LICENSE_OVER_QUOTA | 402/429 | Cuota agotada |
| LICENSE_ORIGIN_NOT_ALLOWED | 403 | URL no autorizada |
| LICENSE_PACKAGE_NOT_ALLOWED | 403 | Package Android no autorizado |
| LICENSE_BUNDLE_NOT_ALLOWED | 403 | Bundle iOS no autorizado |
| LICENSE_CHANNEL_NOT_ALLOWED | 403 | Canal no incluido en licencia |
| LICENSE_ENVIRONMENT_NOT_ALLOWED | 403 | Ambiente no permitido |
