# 06 - Fallback y Disponibilidad de Canales

## Prioridad base

La prioridad recomendada es:

```text
1. WhatsApp
2. SMS
3. Email
```

Puede configurarse por licencia/aplicación.

## Conceptos

### Channel unavailable

El canal no puede usarse por configuración, licencia, target faltante o proveedor caído.

### Provider down

El proveedor del canal está caído, con timeout o autenticación fallida.

### Delivery failed

El proveedor aceptó el mensaje, pero luego reportó no entrega.

### Target missing

No existe teléfono/email requerido para el canal.

## Target requerido por canal

| Canal | Target requerido |
|---|---|
| WhatsApp | phone |
| SMS | phone |
| Email | email |

## Inicialización SDK con target opcional

| Target recibido | Canales posibles | Comentario |
|---|---|---|
| phone + email | WhatsApp, SMS, Email | Fallback completo |
| phone only | WhatsApp, SMS | Email no disponible salvo captura permitida |
| email only | Email | WhatsApp/SMS no disponible salvo captura permitida |
| none | Depende de pantalla inicial | Si no hay captura, error |

## Reglas de fallback

```text
WhatsApp falla → intentar SMS si:
  - SMS habilitado por reglas
  - SMS permitido por licencia
  - Existe phone
  - Cuota SMS disponible
  - Provider SMS healthy

SMS falla → intentar Email si:
  - Email habilitado por reglas
  - Email permitido por licencia
  - Existe email
  - Cuota Email disponible
  - Provider Email healthy
```

## Cuando falta target para fallback

Responder:

```json
{
  "success": false,
  "status": "FAILED_DELIVERY",
  "error": {
    "code": "OTP_FALLBACK_TARGET_MISSING",
    "message": "No existe un destino disponible para el canal alterno.",
    "recoverable": true,
    "action": "REQUEST_TARGET_FOR_ALTERNATE_CHANNEL"
  },
  "fallback": {
    "attempted": false,
    "reason": "EMAIL_TARGET_MISSING",
    "nextAvailableChannels": []
  }
}
```

El SDK puede mostrar pantalla para capturar email/teléfono si:

```json
{
  "allowUserInput": true,
  "allowTargetUpdate": true
}
```

Si no está permitido, debe terminar con error recuperable para app integradora.

## Estados en proceso para SDK

El SDK debe soportar:

| Estado | Mensaje usuario sugerido |
|---|---|
| CREATING_OPERATION | Preparando verificación... |
| LOADING_CONFIG | Cargando configuración... |
| VALIDATING_LICENSE | Validando acceso... |
| SENDING_OTP | Enviando código... |
| WAITING_PROVIDER | Esperando confirmación del proveedor... |
| FALLBACK_IN_PROGRESS | Intentando canal alterno... |
| VERIFYING_OTP | Validando código... |
| RESENDING_OTP | Reenviando código... |

## Proveedor caído

Si WhatsApp provider está caído antes del envío:

- No contar WhatsApp si no se aceptó envío.
- Registrar `OTP_PROVIDER_UNAVAILABLE`.
- Intentar SMS si reglas y target lo permiten.

Si WhatsApp provider acepta envío y luego falla:

- Cuenta WhatsApp.
- Registrar fallo.
- Intentar SMS si reglas y target lo permiten.
- Si SMS se envía, cuenta SMS.

## Respuesta con fallback exitoso

```json
{
  "success": true,
  "operationId": "otp_op_123",
  "challengeId": "otp_ch_sms_456",
  "status": "SENT",
  "channel": "sms",
  "maskedTarget": "+52******5678",
  "fallback": {
    "used": true,
    "from": "whatsapp",
    "to": "sms",
    "reason": "WHATSAPP_PROVIDER_UNAVAILABLE"
  },
  "billing": {
    "billable": true,
    "events": [
      {
        "channel": "sms",
        "billable": true
      }
    ]
  }
}
```

## Fallback automático vs manual

- Automático: backend intenta siguiente canal sin pedir al usuario.
- Manual: SDK muestra “No pudimos enviar por WhatsApp. ¿Enviar por SMS?”

Configuración:

```json
{
  "fallbackMode": "automatic",
  "fallbackOrder": ["whatsapp", "sms", "email"]
}
```

## Android 0.1.0

El mock configurable permite probar `send(channel, fallbackAllowed)` y errores de target/canal sin proveedores reales. Con `mockEnabled == false`, la misma fachada crea el transporte HTTP. `send` y `resend` no deben reintentarse automáticamente: no son acciones idempotentes y el fallback debe obedecer la política del backend.

El mock requiere teléfono para WhatsApp/SMS y email para Email. Si falta devuelve `OTP_TARGET_REQUIRED` con `REQUEST_PHONE` o `REQUEST_EMAIL`. Views y Compose respetan `OtpSession.getPreferredChannel()`; no fuerzan `AUTO`.
