# 10 - Servidores e Infraestructura Estimada

## Componentes necesarios

| Componente | Uso |
|---|---|
| API Gateway / Load Balancer | Entrada HTTPS, WAF, rate limits básicos |
| OTP API | Operaciones, envío, validación, estado |
| Admin API | Clientes, licencias, reglas, reportes |
| Worker/Queue Processor | Envíos asíncronos y reintentos |
| PostgreSQL | Operaciones, licencias, auditoría, configuración |
| Redis | OTP temporal, rate limit, locks, TTL |
| Object Storage opcional | Exportes/reportes |
| Observability | Logs, métricas, alertas |

## MVP bajo volumen

Supuesto: hasta 100k OTP enviados/mes, picos bajos.

| Recurso | Estimado |
|---|---|
| API | 2 instancias 1 vCPU / 1-2 GB RAM |
| Worker | 1-2 instancias 1 vCPU / 1 GB RAM |
| PostgreSQL | 2 vCPU / 4 GB RAM / 50-100 GB SSD |
| Redis | 1 vCPU / 1-2 GB RAM |
| Logs | 7-30 días hot |

## Medio volumen

Supuesto: 1M OTP/mes.

| Recurso | Estimado |
|---|---|
| API | 3-4 instancias 2 vCPU / 4 GB RAM |
| Worker | 3-6 instancias 2 vCPU / 4 GB RAM |
| PostgreSQL | 4-8 vCPU / 16-32 GB RAM / 300 GB SSD |
| Redis | 2-4 vCPU / 8 GB RAM con réplica |
| Queue | SQS/RabbitMQ/PubSub recomendado |

## Alto volumen

Supuesto: 10M OTP/mes.

| Recurso | Estimado |
|---|---|
| API | Autoscaling 6-20 instancias |
| Worker | Autoscaling por cola |
| PostgreSQL | HA, read replicas, particionado por fecha |
| Redis | Cluster/managed HA |
| Queue | Obligatoria |
| Analytics | Data warehouse o tabla particionada |

## Recomendación MVP

Para iniciar serio pero sin castillo inflable:

```text
Cloud Run / ECS / Kubernetes ligero
PostgreSQL managed
Redis managed
Queue managed
WAF + rate limit
Centralized logging
```

## Capacidad por transacción

Cada OTP enviado genera aproximadamente:

- 1 operación o challenge.
- 1 evento de auditoría mínimo.
- 1 evento de uso facturable.
- 1 llamada proveedor.
- 1-3 métricas.

Con fallback puede duplicar o triplicar eventos por operación.
