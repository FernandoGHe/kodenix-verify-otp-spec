# SDK Contract Common

## Inicialización común

```json
{
  "operationId": "otp_op_123",
  "sdkToken": "jwt",
  "target": {
    "phone": "+525512345678",
    "email": "cliente@mail.com"
  },
  "preferredChannel": "whatsapp",
  "autoSend": true
}
```

`target` es opcional. Puede venir:

Al construir un target debe existir al menos teléfono o email; para una sesión sin destino se usa `target: null`. WhatsApp/SMS requieren teléfono y Email requiere correo. El SDK no inventa valores faltantes y el backend mantiene la decisión autoritativa.

- phone + email
- phone only
- email only
- vacío

## Callbacks

- onReady
- onConfigLoaded
- onTargetRequired
- onOtpSending
- onOtpSent
- onFallbackInProgress
- onFallbackTargetMissing
- onOtpVerifying
- onVerificationSuccess
- onVerificationFailed
- onExpired
- onBlocked
- onCancelled
- onError

## Estados UI

- loading config
- validating access
- target capture
- channel selector
- sending
- fallback in progress
- waiting for code
- verifying
- success
- error

## Estado de transporte por plataforma

La documentación de cada SDK debe distinguir mock, sandbox y producción. En Android 0.1.0 el mock es funcional, pero el transporte HTTP de la nueva API Java está pendiente; no debe inferirse disponibilidad productiva. Cancelar una solicitud local impide su callback; cancelar la operación es una acción de dominio independiente.
