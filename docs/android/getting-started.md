# Android: guia de integracion

Esta es la guia completa para integrar **Kodenix Verify OTP** en Android. El
[`README` del proyecto Android](https://github.com/FernandoGHe/kodenix-verify-otp-android#readme)
se mantiene como referencia rapida para quienes trabajan directamente en ese
subproyecto; este documento es la fuente de integracion para clientes.

## Requisitos

- Android API 24 o posterior (`minSdk 24`).
- `compileSdk 36` para compilar el proyecto de referencia.
- Kotlin 2.0.21.
- Java 11 como nivel de bytecode y toolchain compatible.
- AndroidX. Para usar `otp-ui`, una aplicacion con Jetpack Compose.

## Elegir el artefacto

```kotlin
dependencies {
    // Cliente headless, red, modelos y API publica.
    implementation("com.kodenix.verify:otp-core:0.1.0")

    // MVVM y pantalla Jetpack Compose; incluye otp-core transitivamente.
    implementation("com.kodenix.verify:otp-ui:0.1.0")
}
```

Use `otp-core` si la aplicacion aporta su propia UI o solo necesita coordinar el
flujo. Use `otp-ui` para la experiencia Compose mantenida por Kodenix. El modulo
`app` es una demostracion y no se publica como libreria. Dentro del repositorio
Android se usan `project(":otp-core")` y `project(":otp-ui")`; para pruebas locales los AAR y
sus POM pueden publicarse con `gradlew.bat publishToMavenLocal`.

## Seguridad y sesion temporal

La aplicacion movil **nunca debe contener una API key privada**, incluido
`X-Kodenix-Api-Key`. El backend del integrador crea la operacion con sus
credenciales privadas y entrega a la app solamente:

- `operationId`, identificador de la operacion;
- `sdkToken`, token temporal y limitado a esa operacion.

No persista el `sdkToken` ni lo escriba en logs. Cada llamada a `KodenixOtp.create`
crea un cliente aislado y conserva el token solo en memoria.

## Inicializacion

```kotlin
val client = KodenixOtp.create(
    context = applicationContext,
    configuration = KodenixOtpConfiguration(
        environment = OtpEnvironment.SANDBOX,
    ),
    session = OtpSession(
        operationId = backendResponse.operationId,
        sdkToken = backendResponse.sdkToken,
        target = OtpTarget(phone = "+525512345678"), // opcional
        preferredChannel = OtpChannel.WHATSAPP,
        autoSend = true,
    ),
)
```

Los ambientes disponibles son `SANDBOX`, `QA`, `STAGING` y `PRODUCTION`. La
seleccion debe coincidir con el ambiente en el que el backend creo la operacion.

### Target opcional

`OtpTarget` acepta telefono, email o ambos. Puede omitirse al crear la sesion. Si
la politica permite captura, la UI emite `onTargetRequired()` y solicita el dato;
en modo headless el integrador lo proporciona con `updateTarget`. No envie PII a
un ambiente distinto del de la operacion.

## Integracion headless con `otp-core`

Las funciones son `suspend`; invoquelas desde una coroutine y trate ambos casos de
`OtpResult`.

```kotlin
when (val config = client.loadConfiguration()) {
    is OtpResult.Success -> render(config.value)
    is OtpResult.Failure -> showError(config.error)
}

client.updateTarget(OtpTarget(email = "cliente@example.com"))

when (val sent = client.send(OtpChannel.EMAIL)) {
    is OtpResult.Success -> {
        val challengeId = sent.value.challengeId
        val verified = client.verify("123456", challengeId)
    }
    is OtpResult.Failure -> showError(sent.error)
}

client.resend()
client.cancel()
```

### Servicios disponibles

| Servicio | Proposito |
|---|---|
| `loadConfiguration()` | Carga reglas, textos, canales y disponibilidad. |
| `updateTarget(target, reason)` | Proporciona o actualiza telefono/email si la politica lo permite. |
| `send(channel, target, fallbackAllowed)` | Envia el OTP por un canal o seleccion automatica. |
| `resend(channel, fallbackAllowed)` | Reenvia respetando cooldown, limites y fallback. |
| `verify(code, challengeId)` | Verifica el codigo recibido. |
| `cancel(reason)` | Cancela la operacion. |

Los endpoints protegidos con API key privada, como creacion de `operations`,
consulta administrativa de `status` y `events`, pertenecen al backend del
integrador y no se exponen como servicios moviles.

## Integracion con Jetpack Compose

```kotlin
setContent {
    KodenixOtpScreen(
        client = client,
        callbacks = object : OtpCallbacks {
            override fun onTargetRequired() = analytics("target_required")
            override fun onOtpSent(result: OtpSendResult) = analytics("otp_sent")
            override fun onVerificationSuccess(result: OtpVerificationResult) {
                finishOtpFlow(result.operationId)
            }
            override fun onError(error: OtpError) = showError(error)
        },
    )
}
```

`KodenixOtpScreen` crea su `OtpViewModel`, carga la configuracion y representa la
captura de target, seleccion de canal, envio, fallback, ingreso y verificacion del
codigo. El integrador conserva la navegacion exterior y reacciona a callbacks.

## Callbacks

`OtpCallbacks` ofrece implementaciones vacias, por lo que solo es necesario
sobrescribir los eventos relevantes:

- ciclo de configuracion: `onReady`, `onConfigLoaded`, `onTargetRequired`;
- envio: `onOtpSending`, `onOtpSent`, `onFallbackInProgress`,
  `onFallbackTargetMissing`;
- verificacion: `onOtpVerifying`, `onVerificationSuccess`,
  `onVerificationFailed`;
- terminales: `onExpired`, `onBlocked`, `onCancelled`, `onError`.

No registre el codigo OTP, el token temporal ni targets sin enmascarar dentro de
estos callbacks.

## Licenciamiento Android

El SDK obtiene y envia automaticamente la identidad de la app. El backend valida
la licencia mediante la combinacion de:

- package name de la aplicacion;
- SHA-256 del certificado con el que esta firmada;
- ambiente (`sandbox`, `qa`, `staging` o `production`);
- version del SDK.

Registre por separado las huellas de debug, QA y release que se autoricen. Una
coincidencia de package name sin la huella SHA-256 correcta no es suficiente.

## Estado de licencia del codigo Android

El archivo [`LICENSE`](https://github.com/FernandoGHe/kodenix-verify-otp-android/blob/main/LICENSE) esta
marcado **DRAFT - LEGAL REVIEW REQUIRED BEFORE DISTRIBUTION**. Es un borrador para
revision legal y **no representa una licencia comercial aprobada ni autoriza la
distribucion**. La publicacion externa de codigo o artefactos debe esperar la
aprobacion y el acuerdo comercial aplicables.

## Referencias

- [Contrato comun de SDK](../../sdk/sdk-contract-common.md)
- [Contrato Android](../../sdk/sdk-android-contract.md)
- [OpenAPI publico OTP](../../openapi/otp-public-api.yaml)
- [Catalogo de errores](../12-error-catalog.md)
- [Repositorio oficial del SDK Android](https://github.com/FernandoGHe/kodenix-verify-otp-android)

## Actualizacion de esta guia

El SDK y la documentacion tienen ciclos de release independientes. Cada cambio en
la API publica o version del SDK requiere una tarea separada de sincronizacion de
esta guia, contratos, ejemplos y pruebas. `npm run docs:check` valida la coherencia
interna; con `KODENIX_ANDROID_SDK_PATH` definido tambien compara contra un checkout
local del repositorio Android.
