# SDK Android Contract

## Inicialización única 0.1.0

La única fachada pública es `KodenixOtp.create(context, configuration, session)`. `KodenixOtpConfiguration.isMockEnabled()` selecciona el cliente mock o HTTP; no existe un inicializador público separado para mocks. Mock con `PRODUCTION` se rechaza al construir la configuración.

La sesión contiene `operationId`, `sdkToken` temporal, target opcional, canal preferido y autoSend. El integrador nunca proporciona package, fingerprint, plataforma, versión, keystore o API key privada.

## Cliente y targets

`KodenixOtpClient` expone `loadConfiguration`, `updateTarget`, `send`, `resend`, `verify` y `cancel` mediante `OtpCallback`/`OtpRequest`. Callbacks llegan al hilo principal; cancelar el request desconecta HTTP y suprime el callback, mientras `client.cancel` cancela la operación.

WhatsApp/SMS requieren teléfono; Email requiere correo. El SDK no inventa targets. Views y Compose respetan `getPreferredChannel()` y solo muestran targets enmascarados. La captura interna de target ausente continúa pendiente.

## Transporte e identidad

El cliente real usa `/v1/otp/config`, `/target`, `/send`, `/resend`, `/verify` y `/cancel`. Obtiene del `Context` el applicationId efectivo y del `PackageManager` los SHA-256 de firmas legacy/API 28+ `SigningInfo`, incluyendo múltiples firmantes e historial.

Envía Bearer sdkToken y `X-Kodenix-Platform`, `X-Kodenix-Package-Name`, `X-Kodenix-Certificate-Sha256`, `X-Kodenix-Environment`, `X-Kodenix-Sdk-Version`. El backend es autoritativo; no existe bypass o licencia local.

El OpenAPI público solo declara actualmente Platform y Package-Name; faltan Certificate-Sha256, Environment y Sdk-Version. Requiere actualización contractual explícita.

Consulte la [guía Android](../docs/android/getting-started.md).
