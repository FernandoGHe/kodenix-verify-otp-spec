# QA Matrix

| Caso | Target | Primario | Fallback | Resultado esperado |
|---|---|---|---|---|
| Phone+Email | WhatsApp OK | N/A | SENT WhatsApp |
| Phone+Email | WhatsApp down | SMS | SENT SMS fallback |
| Phone only | WhatsApp down | SMS | SENT SMS fallback |
| Phone only | SMS down | Email | OTP_FALLBACK_TARGET_MISSING |
| Email only | WhatsApp | SMS | OTP_TARGET_REQUIRED o canal no disponible |
| None/input true | Auto | Según captura | Pantalla captura |
| None/input false | Auto | N/A | OTP_TARGET_REQUIRED |
| URL no autorizada | Any | Any | LICENSE_ORIGIN_NOT_ALLOWED |
| Cuota agotada | Any | Any | LICENSE_OVER_QUOTA |
