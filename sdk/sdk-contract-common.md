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
