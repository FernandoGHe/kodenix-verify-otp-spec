# SDK Android Contract

## Estado 0.1.0

La API pública se distribuye en `otp-core`, `otp-core-ktx`, `otp-ui-views` y
`otp-ui-compose`. El flujo mock está implementado y validado; el transporte HTTP
de la nueva API Java está pendiente. `KodenixOtp.createMock(...)` es solo para
sandbox/no producción y `KodenixOtp.create(...)` permanece como contrato
planificado, no como funcionalidad disponible.

La aplicación recibe desde el backend integrador `operationId`, `sdkToken`
temporal y, opcionalmente, `target`, `preferredChannel` y `autoSend`. Nunca contiene
una API key privada.

## Operaciones públicas

`KodenixOtpClient` expone `loadConfiguration`, `updateTarget`, dos variantes de
`send`, `resend`, `verify` y `cancel`, todas mediante `OtpCallback` y
`OtpRequest`. Los callbacks se entregan en el hilo principal. Cancelar un
`OtpRequest` suprime ese callback; `KodenixOtpClient.cancel` cancela la operación.
Las extensiones KTX propagan la cancelación de coroutine al request subyacente.

El mock es explícito, en memoria, sin persistencia ni servicios externos; cubre
envío, reenvío, verificación, target enmascarado, código inválido y bloqueo. No es
una validación autoritativa de licencia.

## UI

Views se inicia con `KodenixOtpActivity.createIntent`; sus extras de resultado no
incluyen tokens, targets completos ni fingerprints. Compose expone
`KodenixOtpScreen(client, onFinished)`. Ambas superficies actuales operan con el
mock de sandbox mientras el transporte real está pendiente.

## Licencia de aplicación planificada

El backend validará package name/applicationId, SHA-256 de certificados,
plataforma, ambiente y versión del SDK. Deben contemplarse product flavors,
firmantes múltiples e historial de rotación (`SigningInfo` desde API 28; firmas
legacy en API 24–27). El backend es la autoridad.

Existe una discrepancia pendiente: `openapi/otp-public-api.yaml` no declara por
completo `X-Kodenix-Package-Name`, `X-Kodenix-Certificate-Sha256`,
`X-Kodenix-Environment`, `X-Kodenix-Sdk-Version` y `X-Kodenix-Platform`.

Consulte la [guía Android](../docs/android/getting-started.md).
