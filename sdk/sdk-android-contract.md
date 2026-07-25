# SDK Android Contract

Validaciones asociadas a licencia:

- packageName
- certificate fingerprint SHA-256
- environment
- versión del SDK

El SDK puede iniciar con target opcional y emitir `onTargetRequired` si falta teléfono/email.

La implementación de referencia está en
[kodenix-verify-otp-android](https://github.com/FernandoGHe/kodenix-verify-otp-android)
y la guía de integración completa en
[`docs/android/getting-started.md`](../docs/android/getting-started.md).

La identidad de licencia combina package name, huella SHA-256 del certificado,
ambiente y versión del SDK. `minSdkVersion` es un requisito de compatibilidad, no
un identificador de licencia.

El SDK Android nunca almacena una API key privada. Recibe solo `operationId` y
`sdkToken` temporal desde el backend del integrador.
