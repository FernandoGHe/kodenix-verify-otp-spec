# 02 - Requerimientos

## Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---:|
| RF-001 | Crear operación OTP desde backend cliente o SDK según modo autorizado | Alta |
| RF-002 | Validar licencia antes de emitir sdkToken | Crítica |
| RF-003 | Validar origen Web, package Android o bundle iOS contra licencia | Crítica |
| RF-004 | Permitir enviar OTP por WhatsApp | Alta |
| RF-005 | Permitir fallback WhatsApp a SMS si existe teléfono válido | Alta |
| RF-006 | Permitir fallback SMS a Email si existe email válido | Alta |
| RF-007 | Reportar `OTP_FALLBACK_TARGET_MISSING` cuando no exista destino para canal alterno | Alta |
| RF-008 | Permitir Email como canal directo o fallback | Alta |
| RF-009 | Contabilizar cada OTP enviado como transacción facturable | Crítica |
| RF-010 | Reportar error de proveedor caído sin perder auditoría | Alta |
| RF-011 | Mostrar estados en proceso en SDK | Alta |
| RF-012 | Permitir SDK UI completa | Alta |
| RF-013 | Permitir SDK headless | Alta |
| RF-014 | Permitir inicialización con phone/email/both/none | Alta |
| RF-015 | Permitir pantalla inicial de captura cuando no haya target | Alta |

> Estado Android 0.1.0: RF-015 permanece pendiente en las variantes UI. El mock devuelve `OTP_TARGET_REQUIRED` y no inventa teléfono o email.
| RF-016 | Bloquear operación por intentos fallidos | Alta |
| RF-017 | Expirar OTP por TTL | Alta |
| RF-018 | Exponer webhooks de eventos principales | Media |
| RF-019 | Consultar consumo por cliente/licencia/app | Alta |
| RF-020 | Suspender/reactivar licencias | Alta |

## Requerimientos no funcionales

| ID | Requerimiento | Prioridad |
|---|---|---:|
| RNF-001 | OTP hasheado, nunca texto plano persistente | Crítica |
| RNF-002 | Tokens SDK temporales con TTL corto | Crítica |
| RNF-003 | Rate limit por cliente, licencia, target, IP y operación | Alta |
| RNF-004 | Auditoría inmutable de eventos críticos | Alta |
| RNF-005 | Latencia p95 API menor a 500 ms excluyendo proveedor | Media |
| RNF-006 | Disponibilidad objetivo 99.5% MVP, 99.9% futuro | Media |
| RNF-007 | Compatible con multi-tenant | Alta |
| RNF-008 | Configuración sin recompilar SDK | Alta |

## Requerimientos de seguridad

| ID | Requerimiento |
|---|---|
| SEC-001 | No exponer API keys privadas en SDK Web o nativo |
| SEC-002 | El backend cliente usa API key privada server-to-server |
| SEC-003 | El SDK usa sdkToken temporal emitido por Kodenix |
| SEC-004 | Cada licencia limita allowedOrigins, packageNames o bundleIds |
| SEC-005 | No permitir uso de un token/API key en URLs no autorizadas |
| SEC-006 | Enmascarar teléfono/email en logs y respuestas |
| SEC-007 | Firmar webhooks |
| SEC-008 | Retención limitada de PII |
| SEC-009 | Rotación de API keys y licencias |
| SEC-010 | Bloqueo automático por abuso o consumo anómalo |
