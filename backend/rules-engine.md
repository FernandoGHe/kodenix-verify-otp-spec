# Rules Engine

## Entradas

- clientId
- applicationId
- licenseId
- platform
- environment
- origin/package/bundle
- targetState
- requestedChannel
- providerHealth
- quotaState

## Salidas

- canal seleccionado
- fallbackOrder
- target requerido
- billingPolicy
- acción permitida/rechazada
- error normalizado

## Pseudoflujo

```text
validateLicense()
validateEntitlement()
validateChannelAllowed()
validateQuota()
validateTargetForChannel()
selectProvider()
if provider unavailable -> evaluateFallback()
```
