# Kodenix Verify OTP — Android SDK

SDK Android para integrar Kodenix Verify OTP en modo headless, Android Views/XML o Jetpack Compose. El SDK expone una única fachada: `KodenixOtp.create(...)`. La misma llamada crea el transporte HTTP real o el cliente mock según `KodenixOtpConfiguration`; no existe un inicializador público separado para mocks.

## Artefactos y requisitos

| Artefacto | Java legacy | Kotlin moderno | Compose |
|---|---:|---:|---:|
| `com.kodenix.verify:otp-core:0.1.0` | Sí | Sí | No |
| `com.kodenix.verify:otp-core-ktx:0.1.0` | No requerido | Sí | No |
| `com.kodenix.verify:otp-ui-views:0.1.0` | Sí | Sí | No |
| `com.kodenix.verify:otp-ui-compose:0.1.0` | No | Sí | Sí |

Requiere Android API 24+, AndroidX y Java 8+. Kotlin es opcional salvo para KTX/Compose; Compose requiere Jetpack Compose.

## Instalación y dependencias transitivas

```text
otp-ui-views ──▶ otp-core
otp-core-ktx ──▶ otp-core
otp-ui-compose ──▶ otp-core-ktx ──▶ otp-core
```

Las relaciones son transitivas; el integrador debe declarar la dependencia mínima de su tipo de integración.

### Java headless

```kotlin
dependencies {
    implementation("com.kodenix.verify:otp-core:0.1.0")
}
```

### Java o Kotlin con Views y callbacks

```kotlin
dependencies {
    implementation("com.kodenix.verify:otp-ui-views:0.1.0")
}
```

`otp-ui-views` ya aporta transitivamente toda la API core, modelos, resultados, errores, `KodenixOtpActivity`, `KodenixOtpResult`, `OtpView`, layouts y recursos XML. No incluye `otp-core-ktx`, para no imponer coroutines en aplicaciones Java legacy.

### Kotlin headless

Para callbacks Java puede declararse solo `otp-core`. Para funciones `suspend`, la instalación mínima es:

```kotlin
dependencies {
    implementation("com.kodenix.verify:otp-core-ktx:0.1.0")
}
```

`otp-core-ktx` ya incluye `otp-core`; no declare ambos salvo que una política interna exija dependencias directas explícitas.

### Kotlin con Views y coroutines

```kotlin
dependencies {
    implementation("com.kodenix.verify:otp-ui-views:0.1.0")
    implementation("com.kodenix.verify:otp-core-ktx:0.1.0")
}
```

Views aporta Activity/XML/widgets y KTX aporta coroutines. Ambos comparten `otp-core`, que Gradle resuelve una sola vez.

### Kotlin con Compose

```kotlin
dependencies {
    implementation("com.kodenix.verify:otp-ui-compose:0.1.0")
}
```

`otp-ui-compose` incluye transitivamente `otp-core-ktx` y `otp-core`. Solo añádalos directamente si lo exige la política de dependencias del proyecto.

| Integración | Dependencia mínima |
|---|---|
| Java headless | `otp-core` |
| Java con Views | `otp-ui-views` |
| Kotlin headless con callbacks | `otp-core` |
| Kotlin headless con coroutines | `otp-core-ktx` |
| Kotlin con Views y callbacks | `otp-ui-views` |
| Kotlin con Views y coroutines | `otp-ui-views` + `otp-core-ktx` |
| Kotlin con Compose | `otp-ui-compose` |

| Artefacto | Incluye transitivamente | Java | Kotlin | Compose |
|---|---|---:|---:|---:|
| `otp-core` | Ninguno | Sí | Sí, callbacks | No |
| `otp-core-ktx` | `otp-core` | No requerido | Sí, coroutines | No |
| `otp-ui-views` | `otp-core` | Sí | Sí | No |
| `otp-ui-compose` | `otp-core-ktx` → `otp-core` | No | Sí | Sí |

Mantenga todos los artefactos Kodenix en la misma versión (`0.1.0`); no mezcle versiones.

## Sesión del integrador

El backend integrador entrega únicamente `operationId`, `sdkToken` temporal, target opcional, `preferredChannel` y `autoSend`.

```java
OtpSession session = new OtpSession(
    operationId, sdkToken, target, OtpChannel.EMAIL, true
);
```

El integrador no proporciona applicationId/package name, fingerprints, plataforma, versión del SDK, credenciales de keystore ni API keys privadas. Nunca incluya `X-Kodenix-Api-Key`, secretos server-to-server o tokens permanentes en Android.

`OtpTarget`, `OtpSession` y `KodenixOtpConfiguration` son clases Java. Desde Kotlin invoque sus constructores con argumentos posicionales, no con argumentos nombrados.

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
val configuration = KodenixOtpConfiguration(OtpEnvironment.SANDBOX, true)
```

El escenario predeterminado acepta `123456`. Para personalizarlo:

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

Para utilizar el backend real —también en sandbox— omita la bandera o use `false`:

```kotlin
val configuration = KodenixOtpConfiguration(OtpEnvironment.SANDBOX)
```

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

Ejemplos directos por canal:

```kotlin
val whatsappTarget = OtpTarget("+525512345678", null)
val whatsappChannel = OtpChannel.WHATSAPP

val smsTarget = OtpTarget("+525512345678", null)
val smsChannel = OtpChannel.SMS

val emailTarget = OtpTarget(null, "cliente@empresa.com")
val emailChannel = OtpChannel.EMAIL
```

Si el target contiene teléfono y email, `preferredChannel` determina el canal inicial.

## API headless, threading y cancelación

`KodenixOtpClient` expone `loadConfiguration`, `updateTarget`, `send`, `resend`, `verify` y `cancel`. El transporte ejecuta HTTP fuera del hilo principal y entrega callbacks en el hilo principal.

```java
OtpRequest request = client.send(OtpChannel.WHATSAPP, callback);
request.cancel();       // desconecta la solicitud HTTP y suprime el callback
client.cancel(callback); // cancela la operación OTP en backend
```

Cancelar una solicitud no debe retener una referencia fuerte a la pantalla. En KTX, cancelar la coroutine cancela el `OtpRequest` subyacente.

## Kotlin con Views/XML

Para integraciones AndroidX nuevas se recomienda Activity Result API:

```kotlin
private val otpLauncher =
    registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        val data = result.data
        when (KodenixOtpResult.getStatus(data)) {
            OtpStatus.VERIFIED -> {
                val operationId = data.getStringExtra(KodenixOtpResult.EXTRA_OPERATION_ID)
                val verificationId = data.getStringExtra(KodenixOtpResult.EXTRA_VERIFICATION_ID)
            }
            OtpStatus.CANCELLED -> { /* El usuario canceló el flujo. */ }
            else -> Unit
        }
    }

private fun startOtp() {
    val session = OtpSession(
        operationId, sdkToken,
        OtpTarget("+525512345678", "cliente@empresa.com"),
        OtpChannel.WHATSAPP, true,
    )
    val configuration = KodenixOtpConfiguration(OtpEnvironment.SANDBOX, true)
    otpLauncher.launch(KodenixOtpActivity.createIntent(this, configuration, session))
}
```

## Java legacy con Views/XML

`startActivityForResult` se conserva para compatibilidad; en proyectos nuevos use la API anterior.

```java
private static final int REQUEST_OTP = 4201;

private void startOtp() {
    OtpSession session = new OtpSession(
        operationId, sdkToken,
        new OtpTarget("+525512345678", "cliente@empresa.com"),
        OtpChannel.WHATSAPP, true
    );
    KodenixOtpConfiguration configuration =
        new KodenixOtpConfiguration(OtpEnvironment.SANDBOX, true);
    Intent intent = KodenixOtpActivity.createIntent(this, configuration, session);
    startActivityForResult(intent, REQUEST_OTP);
}

@Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode != REQUEST_OTP || data == null) return;
    OtpStatus status = KodenixOtpResult.getStatus(data);
    String operationId = data.getStringExtra(KodenixOtpResult.EXTRA_OPERATION_ID);
    String verificationId = data.getStringExtra(KodenixOtpResult.EXTRA_VERIFICATION_ID);
}
```

Views devuelve solo estado, operationId, verificationId y error recuperable/acción. No devuelve token, OTP, target completo o fingerprint.

## Compose

Compose usa la misma instancia:

```kotlin
KodenixOtpScreen(client = client) { result ->
    if (result.isVerified) continueIntegratorFlow()
}
```

Ambas UIs soportan longitud dinámica, verificación automática, progreso, errores, cooldown, reenvío, cancelación y target enmascarado.

## Aplicación demo

La app de demostración contiene ejemplos ejecutables de Kotlin con Compose, Kotlin con Views/XML y Activity Result API, y Java legacy con Views/XML y `startActivityForResult`. Todos usan mock para funcionar sin backend. Views usa el escenario predeterminado (`123456`); la pantalla Compose mantiene actualmente un escenario personalizado (`2468`, longitud 4, cooldown 10, tres intentos).

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

### Enums públicos

El SDK convierte los strings wire del backend en tipos seguros. `UNKNOWN` existe únicamente como protección local ante valores futuros y no es un valor que el backend deba emitir normalmente.

| `OtpStatus` | Significado |
|---|---|
| `PENDING` | Operación pendiente. |
| `PENDING_DELIVERY` | Pendiente de iniciar/confirmar envío. |
| `SENDING` | Envío en curso. |
| `SENT` | El proveedor aceptó el envío; no garantiza entrega. |
| `DELIVERED` | Entrega confirmada cuando el proveedor la informa. |
| `VERIFIED` | OTP verificado. |
| `DELIVERY_FAILED` | Rechazo o fallo conocido posteriormente. |
| `EXPIRED` | OTP expirado. |
| `CANCELLED` | Operación cancelada. |
| `BLOCKED` | Operación bloqueada. |
| `UNKNOWN` | Fallback local para compatibilidad futura. |

`OtpErrorCode` expone `INVALID_PHONE`, `INVALID_EMAIL`, `TARGET_REQUIRED`, `TARGET_UNREACHABLE`, `PHONE_NOT_REGISTERED`, `EMAIL_REJECTED`, `MAILBOX_UNAVAILABLE`, `CHANNEL_UNAVAILABLE`, `DELIVERY_FAILED`, `INVALID_CODE`, `MAX_ATTEMPTS_REACHED`, `ALREADY_VERIFIED`, `RATE_LIMITED`, `PROVIDER_UNAVAILABLE`, `NETWORK_ERROR`, `SDK_ERROR` y `UNKNOWN`. Sus valores wire tienen prefijo `OTP_`, por ejemplo `OtpErrorCode.TARGET_UNREACHABLE.getWireValue()` es `OTP_TARGET_UNREACHABLE`.

`OtpErrorAction` expone `NONE`, `REQUEST_PHONE`, `REQUEST_EMAIL`, `CORRECT_PHONE`, `CORRECT_EMAIL`, `RETRY`, `RESEND`, `CHOOSE_ANOTHER_CHANNEL`, `CONTACT_SUPPORT` y `UNKNOWN`. La acción es una recomendación; la aplicación integradora conserva la decisión final.

```kotlin
override fun onError(error: OtpError) {
    when (error.action) {
        OtpErrorAction.CORRECT_PHONE -> showPhoneEditor()
        OtpErrorAction.CORRECT_EMAIL -> showEmailEditor()
        OtpErrorAction.CHOOSE_ANOTHER_CHANNEL -> showChannelSelector()
        OtpErrorAction.RETRY -> showRetry()
        OtpErrorAction.CONTACT_SUPPORT -> showSupport()
        else -> showGenericError(error.message)
    }
}
```

```java
@Override public void onError(OtpError error) {
    switch (error.getAction()) {
        case CORRECT_PHONE: showPhoneEditor(); break;
        case CORRECT_EMAIL: showEmailEditor(); break;
        case CHOOSE_ANOTHER_CHANNEL: showChannelSelector(); break;
        case RETRY: showRetry(); break;
        default: showGenericError(error.getMessage());
    }
}
```

Un formato de teléfono/email inválido puede fallar sincrónicamente. Un número inexistente/no registrado, buzón inexistente o email rechazado puede conocerse después; esos cambios llegan al backend integrador por eventos/webhooks. La app móvil no consulta endpoints privados con API key.

Trate como mínimo los errores `LICENSE_NOT_FOUND`, `LICENSE_EXPIRED`, `LICENSE_SUSPENDED`, `LICENSE_REVOKED`, `LICENSE_OVER_QUOTA`, `LICENSE_PACKAGE_NOT_ALLOWED`, `LICENSE_CHANNEL_NOT_ALLOWED`, `LICENSE_ENVIRONMENT_NOT_ALLOWED`, `OTP_NETWORK_ERROR` y `OTP_SDK_ERROR`. `LICENSE_PACKAGE_NOT_ALLOWED` significa que la combinación instalada de package y certificado no está autorizada.

Se reportaron correctos `:otp-core:testDebugUnitTest`, `:otp-core:assembleRelease`, `:otp-ui-views:assembleRelease`, `:otp-ui-compose:assembleRelease` y `:app:assembleDebug`.

## Contrato OpenAPI Android

`openapi/otp-public-api.yaml` declara los cinco headers que envía la implementación: `X-Kodenix-Platform`, `X-Kodenix-Package-Name`, `X-Kodenix-Certificate-Sha256`, `X-Kodenix-Environment` y `X-Kodenix-Sdk-Version`. También tipa status, códigos y acciones con los mismos valores wire que el SDK.

## Estado legal

La licencia del SDK Android continúa marcada **DRAFT — LEGAL REVIEW REQUIRED BEFORE DISTRIBUTION**; no es una licencia comercial aprobada.

## Referencias

- [Contrato común](../../sdk/sdk-contract-common.md)
- [Contrato Android](../../sdk/sdk-android-contract.md)
- [Seguridad](../05-security-specification.md)
- [Catálogo de errores](../12-error-catalog.md)
