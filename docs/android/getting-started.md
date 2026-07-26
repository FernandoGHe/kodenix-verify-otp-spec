# Android: inicialización, mocks e identidad de licencia

Guía pública de **Kodenix Verify OTP Android 0.1.0**. El SDK expone una única fachada: `KodenixOtp.create(...)`. La misma llamada crea el transporte HTTP real o el cliente mock según `KodenixOtpConfiguration`; no existe un inicializador público separado para mocks.

## Artefactos y requisitos

| Artefacto | Java legacy | Kotlin moderno | Compose |
|---|---:|---:|---:|
| `com.kodenix.verify:otp-core:0.1.0` | Sí | Sí | No |
| `com.kodenix.verify:otp-core-ktx:0.1.0` | No requerido | Sí | No |
| `com.kodenix.verify:otp-ui-views:0.1.0` | Sí | Sí | No |
| `com.kodenix.verify:otp-ui-compose:0.1.0` | No | Sí | Sí |

Requiere Android API 24+, AndroidX y Java 8+. Kotlin es opcional salvo para KTX/Compose; Compose requiere Jetpack Compose.

## Sesión del integrador

El backend integrador entrega únicamente `operationId`, `sdkToken` temporal, target opcional, `preferredChannel` y `autoSend`.

```java
OtpSession session = new OtpSession(
    operationId, sdkToken, target, OtpChannel.EMAIL, true
);
```

El integrador no proporciona applicationId/package name, fingerprints, plataforma, versión del SDK, credenciales de keystore ni API keys privadas. Nunca incluya `X-Kodenix-Api-Key`, secretos server-to-server o tokens permanentes en Android.

## Inicialización productiva

```kotlin
val configuration = KodenixOtpConfiguration(OtpEnvironment.PRODUCTION)
val session = OtpSession(
    operationId, sdkToken,
    OtpTarget("+525512345678", "usuario@example.com"),
    OtpChannel.WHATSAPP, true,
)
val client = KodenixOtp.create(context, configuration, session)
```

```java
KodenixOtpConfiguration configuration =
    new KodenixOtpConfiguration(OtpEnvironment.PRODUCTION);
OtpSession session = new OtpSession(
    operationId, sdkToken,
    new OtpTarget("+525512345678", "usuario@example.com"),
    OtpChannel.WHATSAPP, true
);
KodenixOtpClient client = KodenixOtp.create(context, configuration, session);
```

Con `mockEnabled == false`, `create()` utiliza el transporte HTTP real.

## Inicialización mock

El mock se activa exclusivamente en configuración y conserva la misma API pública:

```kotlin
val scenario = MockOtpScenario("2468", 4, 10, 3)
val configuration = KodenixOtpConfiguration(
    OtpEnvironment.SANDBOX, true, scenario,
)
val session = OtpSession(
    "demo-operation", "demo-token",
    OtpTarget("+525512345678", "usuario@example.com"),
    OtpChannel.WHATSAPP, true,
)
val client = KodenixOtp.create(context, configuration, session)
```

```java
MockOtpScenario scenario = new MockOtpScenario("2468", 4, 10, 3);
KodenixOtpConfiguration configuration =
    new KodenixOtpConfiguration(OtpEnvironment.SANDBOX, true, scenario);
KodenixOtpClient client = KodenixOtp.create(context, configuration, session);
```

Activar mock con `OtpEnvironment.PRODUCTION` falla inmediatamente. El mock funciona en memoria, no llama al backend, no envía mensajes reales, no persiste OTP y permite simular longitud, cooldown e intentos. Úselo solo en desarrollo y pruebas.

## Targets y canales

`OtpTarget(phone, email)` admite ambos o uno; no construya uno con ambos vacíos. Para una sesión sin target use `null`.

| Teléfono | Email | WhatsApp | SMS | Email |
|---|---|---|---|---|
| Sí | Sí | Disponible | Disponible | Disponible |
| Sí | No | Disponible | Disponible | `OTP_TARGET_REQUIRED` |
| No | Sí | `OTP_TARGET_REQUIRED` | `OTP_TARGET_REQUIRED` | Disponible |
| No | No | `OTP_TARGET_REQUIRED` | `OTP_TARGET_REQUIRED` | `OTP_TARGET_REQUIRED` |

Las acciones son `REQUEST_PHONE`, `REQUEST_EMAIL`, `CORRECT_PHONE` y `CORRECT_EMAIL`. Views y Compose respetan `session.getPreferredChannel()`; los canales son `WHATSAPP`, `SMS`, `EMAIL` y `AUTO`. El backend permanece autoritativo.

El teléfono esperado usa `+[código de país][número]`; se eliminan espacios, guiones y paréntesis sin inventar códigos de país. El email elimina espacios exteriores. Las UIs muestran ambos targets enmascarados —por ejemplo `+******5678` y `u***@example.com`—, prefieren `maskedTarget` del backend y no devuelven targets completos.

La captura interna de target cuando la sesión inicia sin teléfono/email sigue pendiente en todas las variantes UI.

## API headless, threading y cancelación

`KodenixOtpClient` expone `loadConfiguration`, `updateTarget`, `send`, `resend`, `verify` y `cancel`. El transporte ejecuta HTTP fuera del hilo principal y entrega callbacks en el hilo principal.

```java
OtpRequest request = client.send(OtpChannel.WHATSAPP, callback);
request.cancel();       // desconecta la solicitud HTTP y suprime el callback
client.cancel(callback); // cancela la operación OTP en backend
```

Cancelar una solicitud no debe retener una referencia fuerte a la pantalla. En KTX, cancelar la coroutine cancela el `OtpRequest` subyacente.

## Views y Compose

Views se inicia con `KodenixOtpActivity.createIntent(context, configuration, session)` y devuelve solo estado, operationId, verificationId y error recuperable/acción. No devuelve token, OTP, target completo o fingerprint.

Compose usa la misma instancia:

```kotlin
KodenixOtpScreen(client = client) { result ->
    if (result.isVerified) continueIntegratorFlow()
}
```

Ambas UIs soportan longitud dinámica, verificación automática, progreso, errores, cooldown, reenvío, cancelación y target enmascarado.

## Identidad Android y licencia

El SDK obtiene obligatoriamente la identidad de la app instalada; no es configuración ni parte de `OtpSession`, y el integrador no puede sobrescribirla. Obtiene el package/applicationId efectivo desde el `Context` y los certificados mediante `PackageManager`.

- API 24–27: firmas legacy.
- API 28+: `SigningInfo`.
- Incluye múltiples firmantes, historial y rotación.
- Calcula SHA-256 de los certificados instalados.
- Usa el applicationId efectivo de cada product flavor, sin package hardcodeado.

El transporte envía internamente:

```http
Authorization: Bearer {sdkToken}
X-Kodenix-Platform: android
X-Kodenix-Package-Name: {packageName efectivo}
X-Kodenix-Certificate-Sha256: {fingerprint instalado}
X-Kodenix-Environment: {environment}
X-Kodenix-Sdk-Version: {sdkVersion}
```

No se solicitan al integrador, no se devuelven en UI, no se guardan en preferencias y no deben registrarse completos en producción. El backend valida package/certificado, ambiente, versión mínima, licencia, cuota y canales. El SDK no implementa bypass local, lista autoritativa de packages, códigos maestros, validación solo con BuildConfig, credenciales privadas ni lectura de JKS.

Cada applicationId de flavors —por ejemplo `com.cliente.app.sandbox` y `com.cliente.app`— debe estar autorizado por la licencia correspondiente.

## Operaciones HTTP móviles

| Método | Ruta |
|---|---|
| GET | `/v1/otp/config` |
| PATCH | `/v1/otp/target` |
| POST | `/v1/otp/send` |
| POST | `/v1/otp/resend` |
| POST | `/v1/otp/verify` |
| POST | `/v1/otp/cancel` |

No expone creación de operaciones, estado/eventos administrativos, administración o analytics privados: pertenecen al backend integrador.

## Errores y estado validado

Trate como mínimo los errores `LICENSE_NOT_FOUND`, `LICENSE_EXPIRED`, `LICENSE_SUSPENDED`, `LICENSE_REVOKED`, `LICENSE_OVER_QUOTA`, `LICENSE_PACKAGE_NOT_ALLOWED`, `LICENSE_CHANNEL_NOT_ALLOWED`, `LICENSE_ENVIRONMENT_NOT_ALLOWED`, `OTP_NETWORK_ERROR` y `OTP_SDK_ERROR`. `LICENSE_PACKAGE_NOT_ALLOWED` significa que la combinación instalada de package y certificado no está autorizada.

Se reportaron correctos `:otp-core:testDebugUnitTest`, `:otp-core:assembleRelease`, `:otp-ui-views:assembleRelease`, `:otp-ui-compose:assembleRelease` y `:app:assembleDebug`.

## Discrepancia OpenAPI

La implementación envía los cinco headers Android. `openapi/otp-public-api.yaml` declara actualmente `X-Kodenix-Platform` y `X-Kodenix-Package-Name`, pero faltan `X-Kodenix-Certificate-Sha256`, `X-Kodenix-Environment` y `X-Kodenix-Sdk-Version`. Deben añadirse mediante un cambio contractual explícito; esta actualización no modifica silenciosamente el OpenAPI.

## Estado legal

La licencia del SDK Android continúa marcada **DRAFT — LEGAL REVIEW REQUIRED BEFORE DISTRIBUTION**; no es una licencia comercial aprobada.

## Referencias

- [Contrato común](../../sdk/sdk-contract-common.md)
- [Contrato Android](../../sdk/sdk-android-contract.md)
- [Seguridad](../05-security-specification.md)
- [Catálogo de errores](../12-error-catalog.md)
