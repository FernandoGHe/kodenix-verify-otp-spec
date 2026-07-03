# 08 - Máquina de Estados

Estados principales:

```text
CREATED
LICENSE_VALIDATING
LICENSE_REJECTED
CONFIG_LOADED
PENDING_TARGET
PENDING_DELIVERY
SEND_ACCEPTED
SENT
DELIVERED
FAILED_DELIVERY
FALLBACK_EVALUATING
FALLBACK_IN_PROGRESS
PENDING_VERIFICATION
INVALID_ATTEMPT
VERIFIED
EXPIRED
BLOCKED
CANCELLED
```

## Reglas

- `SEND_ACCEPTED` genera evento facturable.
- `FAILED_DELIVERY` no revierte facturación si ocurrió después de `SEND_ACCEPTED`.
- `FALLBACK_IN_PROGRESS` puede generar un segundo `SEND_ACCEPTED` si el canal alterno se envía.
- `LICENSE_REJECTED` nunca debe generar envío.
- `PENDING_TARGET` se usa cuando el SDK requiere teléfono/email adicional.

Ver `diagrams/state-machine.mmd`.
