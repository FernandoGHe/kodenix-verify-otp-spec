# Test Cases

## Licencias

- TC-LIC-001 Crear licencia Web para una URL.
- TC-LIC-002 Rechazar uso desde URL distinta.
- TC-LIC-003 Crear segunda licencia para otra URL.
- TC-LIC-004 Rechazar canal no autorizado.
- TC-LIC-005 Rechazar por cuota agotada.

## Transacciones

- TC-BIL-001 WhatsApp SEND_ACCEPTED crea usage billable.
- TC-BIL-002 Número inexistente posterior a aceptación mantiene billable.
- TC-BIL-003 Payload inválido no genera usage.
- TC-BIL-004 Fallback WhatsApp->SMS genera dos usage si ambos se aceptan.

## Target opcional

- TC-TGT-001 SDK inicia con phone+email.
- TC-TGT-002 SDK inicia solo con phone.
- TC-TGT-003 SDK inicia solo con email.
- TC-TGT-004 SDK inicia sin target y captura permitida.
- TC-TGT-005 SDK inicia sin target y captura no permitida.

## Fallback

- TC-FBK-001 WhatsApp caído, phone existe, SMS permitido.
- TC-FBK-002 WhatsApp caído, SMS no permitido por licencia.
- TC-FBK-003 SMS caído, email faltante.
- TC-FBK-004 Email caído, sin fallback disponible.
