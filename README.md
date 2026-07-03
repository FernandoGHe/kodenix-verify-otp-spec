# Kodenix Verify OTP Specification

Documentación técnica del producto **Kodenix Verify OTP SDK/API**.

## Alcance del paquete

- SDK Web, Android e iOS.
- API pública OTP.
- API Admin.
- API de licenciamiento.
- API interna de proveedores.
- API de analytics/usage.
- Webhooks.
- Licenciamiento por cliente, aplicación, ambiente, plataforma y URL/app nativa.
- Cobro por OTP enviado.
- Control para impedir reutilizar una licencia/API key en sitios no autorizados.
- Fallback WhatsApp → SMS → Email.
- Target opcional en inicialización del SDK: teléfono/email puede venir desde el integrador o capturarse en la UI del SDK.
- Seguridad, auditoría, infraestructura, runbooks, QA y conteo transaccional.

## Navegación principal

1. [Gobierno de documentación](docs/00-documentation-governance.md)
2. [Alcance funcional](docs/01-functional-scope.md)
3. [Requerimientos](docs/02-requirements.md)
4. [Licenciamiento y control de uso](docs/03-licensing-and-usage-control.md)
5. [Conteo transaccional y facturación](docs/04-transaction-counting-and-billing.md)
6. [Seguridad](docs/05-security-specification.md)
7. [Fallback y disponibilidad de canales](docs/06-fallback-and-channel-availability.md)
8. [Contrato API](docs/07-api-contract-overview.md)
9. [Máquina de estados](docs/08-state-machine.md)
10. [Modelo de datos](docs/09-data-model.md)
11. [Infraestructura](docs/10-infrastructure-sizing.md)
12. [Observabilidad y auditoría](docs/11-observability-audit.md)
13. [Catálogo de errores](docs/12-error-catalog.md)
14. [Webhooks](docs/13-webhooks.md)
15. [SLA y disponibilidad](docs/14-sla-and-availability.md)
16. [Versionado](docs/15-release-versioning.md)
17. [Superficie de publicación](docs/16-published-documentation-surface.md)

## APIs

- [Swagger UI](swagger-ui/index.html)
- [OpenAPI Index](openapi/README.md)
- [Admin API](openapi/admin-api.yaml)
- [Analytics API](openapi/analytics-api.yaml)
- [Licensing API](openapi/licensing-api.yaml)
- [OTP Public API](openapi/otp-public-api.yaml)
- [Provider Internal API](openapi/provider-internal-api.yaml)
- [Webhooks API](openapi/webhooks-api.yaml)

## Diagramas

- [Diagramas renderizados](diagrams/README.md)
- [Component Diagram](diagrams/component.mmd)
- [Deployment Diagram](diagrams/deployment.mmd)
- [ERD Licensing](diagrams/erd-licensing.mmd)
- [Outage Flow](diagrams/outage-flow.mmd)
- [Security Token Flow](diagrams/security-token-flow.mmd)
- [Enterprise License Sequence](diagrams/sequence-enterprise-license.mmd)
- [Provider Fallback Sequence](diagrams/sequence-provider-fallback.mmd)
- [SDK Init Target Optional Sequence](diagrams/sequence-sdk-init-target-optional.mmd)
- [State Machine](diagrams/state-machine.mmd)

## Backend handoff

- [Backend Handoff](backend/backend-handoff.md)
- [Database Model](backend/database-model.md)
- [Domain Model](backend/domain-model.md)
- [Provider Contract](backend/provider-contract.md)
- [Rules Engine](backend/rules-engine.md)

## SDK contracts

- [Common SDK Contract](sdk/sdk-contract-common.md)
- [Web SDK Contract](sdk/sdk-web-contract.md)
- [Android SDK Contract](sdk/sdk-android-contract.md)
- [iOS SDK Contract](sdk/sdk-ios-contract.md)
- [UI/UX Spec](sdk/ui-ux-spec.md)
- [Localization Spec](sdk/localization-spec.md)

## Administración

- [Admin Portal Spec](admin/admin-portal-spec.md)
- [Tenant License Configuration](admin/tenant-license-configuration.md)

## Operaciones

- [Capacity Planning](operations/capacity-planning.md)
- [Incident Response](operations/incident-response.md)
- [Monitoring Alerts](operations/monitoring-alerts.md)
- [Runbook](operations/runbook.md)

## QA

- [Acceptance Criteria](qa/acceptance-criteria.md)
- [QA Matrix](qa/qa-matrix.md)
- [Test Cases](qa/test-cases.md)

## Postman

- [Postman Collection](postman/kodenix-verify-otp-v2.postman_collection.json)

## Seguridad documental

Los valores incluidos en este repositorio son ejemplos de especificación. No forman parte del material autorizado: secretos reales, tokens productivos, credenciales de proveedores, llaves privadas o URLs internas sensibles.
