# 05 - Especificación de Seguridad

## Modelo de confianza

El SDK no es confiable por sí mismo. Web, Android e iOS pueden ser inspeccionados, modificados o automatizados. Por eso:

- Las API keys privadas viven solo en backend cliente y backend Kodenix.
- El SDK usa `sdkToken` temporal.
- El backend Kodenix valida licencia, origen, app, cuota y reglas en cada acción sensible.

## Autenticación

### Server-to-server

Header:

```http
X-Kodenix-Api-Key: kx_live_xxx
```

Usado por backend cliente para:

- Crear operación.
- Consultar estado final.
- Consultar auditoría.
- Descargar reportes de uso.

### SDK token

Bearer JWT temporal:

```http
Authorization: Bearer eyJhbGciOi...
```

Claims mínimos:

```json
{
  "sub": "otp_op_123",
  "clientId": "client_001",
  "applicationId": "app_001",
  "licenseId": "lic_001",
  "platform": "web",
  "environment": "production",
  "allowedChannels": ["whatsapp", "sms", "email"],
  "iat": 1783123000,
  "exp": 1783123600
}
```

## Validación anti-reuso por sitio/app

### Web

Validar `Origin` contra licencia.

Si `Origin=https://landing.cliente.com` y licencia solo permite `https://onboarding.cliente.com`, responder:

```json
{
  "success": false,
  "error": {
    "code": "LICENSE_ORIGIN_NOT_ALLOWED",
    "message": "El origen web no está autorizado para esta licencia.",
    "recoverable": false,
    "action": "CREATE_OR_UPDATE_LICENSE_FOR_ORIGIN"
  }
}
```

### Android

La identidad implementada incluye package name/applicationId efectivo, todos los SHA-256 de firma aplicables, plataforma, ambiente y versión del SDK. Se obtiene de la app instalada y soporta flavors, firmantes múltiples e historial de rotación. El integrador no puede sobrescribirla. El backend es siempre la autoridad; el mock local no acredita una licencia.

El SDK recibe únicamente `operationId` y `sdkToken` temporal. Nunca se distribuyen en la app API keys privadas, claves privadas, credenciales de servidor/proveedor, contraseñas de keystore ni tokens permanentes. El transporte envía internamente Bearer y los cinco headers de identidad. El OpenAPI declara Platform y Package-Name, pero aún debe incorporar Certificate-Sha256, Environment y Sdk-Version.

Los targets se muestran únicamente enmascarados. Si existe `maskedTarget` del backend se prefiere ese valor; el enmascaramiento local es respaldo. No se registran targets completos ni se incluyen en resultados de Activity.

Validar package y certificate fingerprint.

### iOS

Validar bundle ID y Team ID si está configurado.

## OTP seguro

- Generar con CSPRNG.
- Longitud configurable: 4, 6 u 8, recomendado 6.
- TTL recomendado: 5 minutos.
- Almacenar hash + salt.
- Nunca loggear código.
- Comparación constante para evitar timing leaks.

## Rate limiting

Dimensiones:

- clientId
- licenseId
- applicationId
- IP
- target phone/email hash
- operationId
- device/session id opcional

## Datos sensibles

Logs solo con destino enmascarado:

```text
+52******5678
f***@dominio.com
```

Para correlación usar hash irreversible del target.

## Protección contra replay

- sdkToken atado a operationId.
- sdkToken con TTL corto.
- challengeId activo único por operación/canal.
- Nonce opcional para endpoints críticos.

## Webhooks seguros

Headers:

```http
X-Kodenix-Event-Id
X-Kodenix-Timestamp
X-Kodenix-Signature: sha256=...
```

Firma sobre:

```text
timestamp + "." + rawBody
```

## Retención recomendada

| Dato | Retención |
|---|---:|
| OTP hash | TTL + 24h máximo |
| Operación | 90-180 días |
| Auditoría | 1-5 años según contrato |
| PII completa | Evitar o cifrar, retención mínima |
| Métricas agregadas | 2-5 años |
