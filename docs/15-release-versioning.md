# 15 - Versionado y Releases

## Versionado

Usar SemVer:

```text
MAJOR.MINOR.PATCH
```

## Compatibilidad

- OpenAPI versionada por path `/v1`.
- SDK debe enviar `sdkVersion`.
- Licencia puede definir `minSdkVersion` y `maxSdkVersion`.

## Política

- Cambios breaking solo en major.
- Nuevos campos opcionales permitidos en minor.
- Fixes internos en patch.
