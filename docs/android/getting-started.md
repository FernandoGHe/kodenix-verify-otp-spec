# Android: integración real y modo mock

Guía pública de **Kodenix Verify OTP Android 0.1.0**. La versión actual permite
integrar y validar de extremo a extremo un flujo mock en memoria. El transporte
HTTP para backend Kodenix todavía no está conectado a la nueva API Java; por
tanto, la integración no-mock descrita al final es un contrato planificado y no
debe considerarse lista para producción.

## Requisitos

- Android API 24 o posterior (`minSdk 24`).
- Proyecto AndroidX y Java 8 o posterior.
- Kotlin es opcional para `otp-core` y `otp-ui-views`.
- Kotlin y Jetpack Compose son obligatorios para `otp-ui-compose`.

## Artefactos 0.1.0

| Artefacto | Java legacy | Kotlin moderno | Compose | Uso |
|---|---:|---:|---:|---|
| `otp-core` | Sí | Sí | No | API Java headless, modelos y flujo mock. |
| `otp-core-ktx` | No requerido | Sí | No | Extensiones `suspend` sobre `otp-core`. |
| `otp-ui-views` | Sí | Sí | No | Flujo visual basado en Views/Activity. |
| `otp-ui-compose` | No | Sí | Sí | Pantalla Compose reutilizable. |

### Java con Views

```kotlin
dependencies {
    implementation("com.kodenix.verify:otp-core:0.1.0")
    implementation("com.kodenix.verify:otp-ui-views:0.1.0")
}
```

### Kotlin sin Compose

```kotlin
dependencies {
    implementation("com.kodenix.verify:otp-core:0.1.0")
    implementation("com.kodenix.verify:otp-core-ktx:0.1.0")
}
```

### Kotlin con Compose

```kotlin
dependencies {
    implementation("com.kodenix.verify:otp-core-ktx:0.1.0")
    implementation("com.kodenix.verify:otp-ui-compose:0.1.0")
}
```

## Sesión y seguridad

El backend del integrador crea la operación y entrega a la app solamente
`operationId` y un `sdkToken` temporal. También puede entregar `target`,
`preferredChannel` y `autoSend`.

```java
OtpSession minimal = new OtpSession(operationId, sdkToken);

OtpSession complete = new OtpSession(
    operationId,
    sdkToken,
    new OtpTarget("+525512345678", null), // opcional
    OtpChannel.WHATSAPP,
    true
);
```

Nunca incluya en una app `X-Kodenix-Api-Key`, API keys privadas, credenciales de
servidor o proveedores, contraseñas de keystore ni tokens permanentes. No persista
ni registre el `sdkToken`, el OTP o targets completos.

## Modo mock funcional

El mock se selecciona explícitamente con `createMock`, funciona solo fuera de
`PRODUCTION`, no usa servicios externos ni persistencia y mantiene su estado en
memoria. No valida licencias de forma autoritativa. El código aceptado por defecto
es `123456`.

```java
KodenixOtpConfiguration configuration =
    new KodenixOtpConfiguration(OtpEnvironment.SANDBOX);
KodenixOtpClient client = KodenixOtp.createMock(
    context, configuration, new OtpSession(operationId, sdkToken)
);
```

Un escenario permite códigos de 4, 6 u 8 dígitos, cooldown y máximo de intentos:

```java
MockOtpScenario scenario = new MockOtpScenario("246810", 6, 30, 3);
KodenixOtpClient client = KodenixOtp.createMock(
    context, configuration, session, scenario
);
```

El mock cubre carga de configuración, target enmascarado, `send`, `resend`,
`verify`, `cancel`, `updateTarget`, código inválido y bloqueo por intentos. Rechaza
`OtpEnvironment.PRODUCTION`. Nunca use ni recomiende `createMock()` en producción.

## API Java headless

Los callbacks se entregan en el hilo principal. Cada operación devuelve un
`OtpRequest`; llamar `OtpRequest.cancel()` cancela esa solicitud local y suprime su
callback. Es distinto de `client.cancel(...)`, que cancela la operación OTP.

```java
OtpRequest load = client.loadConfiguration(new OtpCallback<OtpRuntimeConfiguration>() {
    @Override public void onSuccess(OtpRuntimeConfiguration value) {
        int otpLength = value.getRules().getOtpLength();
    }
    @Override public void onError(OtpError error) { handle(error); }
});

client.updateTarget(new OtpTarget(null, "cliente@example.com"), callback);
client.send(OtpChannel.AUTO, callback);
client.send(OtpChannel.WHATSAPP, false, callback); // sin fallback
client.resend(callback);
client.verify(code, challengeId, callback); // valide longitud desde configuración
```

Cancelaciones:

```java
load.cancel();                  // solo la solicitud local; no llega callback
client.cancel(operationCallback); // cancela la operación OTP
```

Servicios de `KodenixOtpClient`:

| Servicio | Resultado |
|---|---|
| `loadConfiguration(callback)` | Reglas, canales y textos. |
| `updateTarget(target, callback)` | Actualiza teléfono/email permitido. |
| `send(channel, callback)` | Envía con fallback permitido. |
| `send(channel, fallbackAllowed, callback)` | Control explícito de fallback. |
| `resend(callback)` | Reenvía respetando cooldown. |
| `verify(code, challengeId, callback)` | Verifica con longitud dinámica. |
| `cancel(callback)` | Cancela la operación. |

## Kotlin KTX headless

`otp-core-ktx` adapta callbacks a coroutines. La cancelación de la coroutine
cancela el `OtpRequest` subyacente.

```kotlin
try {
    val runtime = client.loadConfigurationAwait()
    val sent = client.send(OtpChannel.AUTO, fallbackAllowed = true)
    val verified = client.verify(code, sent.challengeId)
    client.resendAwait()
    client.cancelAwait()
} catch (error: OtpException) {
    handle(error.error)
}
```

## UI con Views

```java
Intent intent = KodenixOtpActivity.createIntent(context, configuration, session);
launcher.launch(intent);
```

Lea el resultado mediante `KodenixOtpResult.EXTRA_STATUS`,
`EXTRA_OPERATION_ID`, `EXTRA_VERIFICATION_ID`, `EXTRA_ERROR_CODE`,
`EXTRA_RECOVERABLE` y `EXTRA_ACTION`. La UI no devuelve secretos, targets
completos ni huellas de certificado. Incluye longitud dinámica, autoavance,
accesibilidad, feedback de error/éxito, cooldown y reenvío.

En 0.1.0 `KodenixOtpActivity` crea internamente un cliente mock y rechaza
`PRODUCTION`; es una experiencia sandbox mientras se conecta el transporte real.

## UI con Compose

```kotlin
val client = KodenixOtp.createMock(context, configuration, session)

KodenixOtpScreen(
    client = client,
    onFinished = { result -> finishOtpFlow(result.operationId) },
)
```

La pantalla carga reglas, envía, muestra el target enmascarado, adapta la longitud
del OTP, verifica automáticamente al completarse, controla cooldown/reenvío y
presenta estados de error, éxito y cancelación.

## Errores

Trate `OtpError.getCode()`, `isRecoverable()`, `getAction()` y
`getHttpStatus()` sin mostrar detalles internos:

```java
private void handle(OtpError error) {
    if (error.isRecoverable()) showRetry(error.getCode());
    else finishWithError(error.getCode(), error.getAction());
}
```

El catálogo incluye errores de licencia, target, canal, fallback, proveedor,
entrega, rate limit, código inválido/expirado, máximo de intentos, operación y red.

## Contrato no-mock planificado

`KodenixOtp.create(...)` **no forma parte de la API funcional 0.1.0**. Cuando se
implemente, el transporte deberá ejecutar HTTP fuera del hilo principal, entregar
callbacks en el hilo principal, autenticar con `Authorization: Bearer <sdkToken>`
y enviar la identidad Android requerida. No deberá reintentar automáticamente
`send` o `resend`, persistir/loguear datos sensibles ni exponer endpoints internos.
Deberá propagar errores de red y servidor mediante `OtpError`.

El uso previsto, que no compila contra la fachada 0.1.0 actual, será:

```java
KodenixOtpClient client = KodenixOtp.create(
    context,
    new KodenixOtpConfiguration(OtpEnvironment.PRODUCTION),
    new OtpSession(operationId, sdkToken, target, OtpChannel.WHATSAPP, true)
);
```

## Identidad y licenciamiento Android planificados

El backend será la autoridad. La identidad esperada combina:

- package name/applicationId;
- SHA-256 de los certificados de firma;
- plataforma, ambiente y versión del SDK.

Cada product flavor y ambiente debe registrar sus valores autorizados. En API
24–27 se consideran las firmas legacy; en API 28+ se usa `SigningInfo`, incluyendo
múltiples firmantes e historial para rotación de certificados. La recolección y
envío automático de esta identidad pertenece al transporte real pendiente.

El OpenAPI actual aún no declara completamente los headers
`X-Kodenix-Package-Name`, `X-Kodenix-Certificate-Sha256`,
`X-Kodenix-Environment`, `X-Kodenix-Sdk-Version` y `X-Kodenix-Platform`. Esta
discrepancia debe resolverse en `openapi/otp-public-api.yaml` antes de conectar el
transporte; esta actualización documental no cambia silenciosamente el contrato.

## Estado legal

La licencia del SDK Android está marcada **DRAFT — LEGAL REVIEW REQUIRED BEFORE
DISTRIBUTION**. No es una licencia comercial aprobada ni autoriza distribución.

## Referencias

- [Contrato común de SDK](../../sdk/sdk-contract-common.md)
- [Contrato Android](../../sdk/sdk-android-contract.md)
- [Catálogo de errores](../12-error-catalog.md)
- [Seguridad](../05-security-specification.md)
