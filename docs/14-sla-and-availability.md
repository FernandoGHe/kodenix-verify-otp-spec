# 14 - SLA y Disponibilidad

## Objetivos iniciales

| Métrica | MVP | Futuro |
|---|---:|---:|
| API availability | 99.5% | 99.9% |
| Dashboard/Admin | 99.0% | 99.5% |
| p95 API latency interna | < 500 ms | < 300 ms |
| Recovery provider fallback | < 60 s | < 15 s |

## Dependencias externas

WhatsApp, SMS y Email dependen de terceros. El SLA final de entrega no puede garantizarse 100%.

La plataforma sí garantiza:

- Registrar intento.
- Reportar fallo.
- Intentar fallback según reglas.
- Auditar y exponer estado.
