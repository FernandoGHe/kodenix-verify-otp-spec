# Acceptance Criteria

- No se puede usar SDK Web desde URL no autorizada.
- No se puede usar Android desde package/fingerprint no autorizado.
- No se puede enviar canal no incluido en licencia.
- Cada SEND_ACCEPTED genera usage billable.
- Si WhatsApp falla y existe teléfono, se intenta SMS según reglas.
- Si SMS falla y no existe email, se responde OTP_FALLBACK_TARGET_MISSING.
- Si SDK inicia sin target y allowUserInput=true, muestra captura.
- Si SDK inicia sin target y allowUserInput=false, responde OTP_TARGET_REQUIRED.
