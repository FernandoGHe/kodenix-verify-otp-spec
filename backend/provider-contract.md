# Provider Contract

Interfaz lógica:

```ts
interface OtpProvider {
  send(request: ProviderSendRequest): Promise<ProviderSendResponse>;
  health(): Promise<ProviderHealth>;
}
```

Errores normalizados:

- PROVIDER_UNAVAILABLE
- PROVIDER_TIMEOUT
- PROVIDER_AUTH_ERROR
- PROVIDER_RATE_LIMIT
- PROVIDER_INVALID_TARGET
- PROVIDER_TEMPLATE_ERROR
- PROVIDER_DELIVERY_FAILED

Regla: si el proveedor no acepta el envío por indisponibilidad previa, no se crea usage del canal primario. Si Kodenix ya aceptó el envío y lo despachó, cuenta.
