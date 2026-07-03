# Incident Response

Severidades:

- SEV1: API OTP no envía ningún canal.
- SEV2: WhatsApp caído con SMS operativo.
- SEV3: Degradación parcial de un cliente/licencia.
- SEV4: Error de configuración o URL no autorizada.

Para SEV2 WhatsApp:

- Mantener conteo de WhatsApp solo si hubo SEND_ACCEPTED.
- Fallback SMS cuenta como transacción independiente.
- Comunicar degradación de canal primario.
