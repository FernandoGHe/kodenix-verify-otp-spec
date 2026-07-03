# SDK Web Contract

## Instalación

```bash
npm install @kodenix/verify-otp-web
```

## Uso UI

```ts
KodenixVerifyOtp.start({
  operationId,
  sdkToken,
  target: { phone, email }, // opcional
  onFallbackTargetMissing: (event) => {},
  onSuccess: (result) => {},
  onError: (error) => {}
});
```

## Seguridad Web

El backend valida `Origin` contra `allowedOrigins` de la licencia. Si se usa otra URL, responder `LICENSE_ORIGIN_NOT_ALLOWED`.
