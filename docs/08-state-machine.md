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

## Contrato público del SDK

El SDK Android proyecta el estado backend al enum `OtpStatus`: `PENDING`, `PENDING_DELIVERY`, `SENDING`, `SENT`, `DELIVERED`, `VERIFIED`, `DELIVERY_FAILED`, `EXPIRED`, `CANCELLED` y `BLOCKED`. Otros estados internos de orquestación no se exponen como valores públicos. `UNKNOWN` es un fallback local de compatibilidad, no un estado emitible normal del backend.

`SENT` solo confirma que el proveedor aceptó el envío. No prueba entrega. `DELIVERED` confirma entrega cuando el proveedor ofrece esa señal; `DELIVERY_FAILED` representa un rechazo o fallo conocido posteriormente. Por ello una operación puede avanzar de `SENT` a `DELIVERED` o `DELIVERY_FAILED` mediante eventos asíncronos.

Cancelar un `OtpRequest` Android es control local y no cambia esta máquina; `KodenixOtpClient.cancel` sí solicita `CANCELLED`. El mock reproduce transiciones principales en memoria, pero no representa entrega, facturación o licencia autoritativa.

En transporte HTTP, cancelar el request desconecta la conexión activa y suprime el callback; no equivale a la transición de dominio `CANCELLED`.

En Android, enviar sin el target requerido conserva el flujo en `PENDING_TARGET` y entrega `OTP_TARGET_REQUIRED`. La UI no inventa el destino; la captura interna permanece pendiente en 0.1.0.
