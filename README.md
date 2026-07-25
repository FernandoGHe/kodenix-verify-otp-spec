# Kodenix Verify OTP

Repositorio oficial de especificaciones, contratos y documentación de integración
de **Kodenix Verify OTP**.

## Arquitectura de repositorios

- Documentación: `kodenix-verify-otp-spec` (este repositorio).
- [Android SDK](https://github.com/FernandoGHe/kodenix-verify-otp-android):
  `otp-core`, `otp-ui` y aplicación demo.
- iOS y Web tendrán repositorios independientes.
- `sdk/`: contratos comunes y por plataforma.
- `openapi/`: contratos de las APIs.
- `docs/`: documentación central, seguridad, operación y guías de integración.
- `docs-html/`: sitio generado; no se edita manualmente.
- `backend/`, `admin/`, `operations/` y `qa/`: handoff y especificaciones por área.

No se usan submódulos. Cada SDK mantiene su propio versionado y ciclo de releases;
después de cambiar un SDK debe ejecutarse una tarea separada de actualización de
este repositorio documental.

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

1. [Gobierno de documentación](docs-html/docs/00-documentation-governance.html)
2. [Alcance funcional](docs-html/docs/01-functional-scope.html)
3. [Requerimientos](docs-html/docs/02-requirements.html)
4. [Licenciamiento y control de uso](docs-html/docs/03-licensing-and-usage-control.html)
5. [Conteo transaccional y facturación](docs-html/docs/04-transaction-counting-and-billing.html)
6. [Seguridad](docs-html/docs/05-security-specification.html)
7. [Fallback y disponibilidad de canales](docs-html/docs/06-fallback-and-channel-availability.html)
8. [Contrato API](docs-html/docs/07-api-contract-overview.html)
9. [Máquina de estados](docs-html/docs/08-state-machine.html)
10. [Modelo de datos](docs-html/docs/09-data-model.html)
11. [Infraestructura](docs-html/docs/10-infrastructure-sizing.html)
12. [Observabilidad y auditoría](docs-html/docs/11-observability-audit.html)
13. [Catálogo de errores](docs-html/docs/12-error-catalog.html)
14. [Webhooks](docs-html/docs/13-webhooks.html)
15. [SLA y disponibilidad](docs-html/docs/14-sla-and-availability.html)
16. [Versionado](docs-html/docs/15-release-versioning.html)
17. [Superficie de publicación](docs-html/docs/16-published-documentation-surface.html)
18. [Guía de integración Android](docs-html/docs/android/getting-started.html)

## APIs

- [Swagger UI](swagger-ui/index.html)
- [OpenAPI Index](docs-html/openapi/README.html)
- [Admin API](openapi/admin-api.yaml)
- [Analytics API](openapi/analytics-api.yaml)
- [Licensing API](openapi/licensing-api.yaml)
- [OTP Public API](openapi/otp-public-api.yaml)
- [Provider Internal API](openapi/provider-internal-api.yaml)
- [Webhooks API](openapi/webhooks-api.yaml)

## Diagramas

- [Vista HTML de diagramas](docs-html/diagrams/README.html)
- [Índice visual de diagramas](docs-html/diagrams/README.html)

## Diagramas fuente

- [Diagramas renderizados](docs-html/diagrams/README.html)
- [Component Diagram](diagrams/component.mmd)
- [Deployment Diagram](diagrams/deployment.mmd)
- [ERD Licensing](docs-html/diagrams/erd-licensing.html)
- [Outage Flow](docs-html/diagrams/outage-flow.html)
- [Security Token Flow](docs-html/diagrams/security-token-flow.html)
- [Enterprise License Sequence](diagrams/sequence-enterprise-license.mmd)
- [Provider Fallback Sequence](diagrams/sequence-provider-fallback.mmd)
- [SDK Init Target Optional Sequence](diagrams/sequence-sdk-init-target-optional.mmd)
- [State Machine](docs-html/diagrams/state-machine.html)

## Backend handoff

- [Backend Handoff](docs-html/backend/backend-handoff.html)
- [Database Model](docs-html/backend/database-model.html)
- [Domain Model](docs-html/backend/domain-model.html)
- [Provider Contract](docs-html/backend/provider-contract.html)
- [Rules Engine](docs-html/backend/rules-engine.html)

## SDK contracts

- [Common SDK Contract](docs-html/sdk/sdk-contract-common.html)
- [Web SDK Contract](docs-html/sdk/sdk-web-contract.html)
- [Android SDK Contract](docs-html/sdk/sdk-android-contract.html)
- [iOS SDK Contract](docs-html/sdk/sdk-ios-contract.html)
- [UI/UX Spec](docs-html/sdk/ui-ux-spec.html)
- [Localization Spec](docs-html/sdk/localization-spec.html)
- [Android: guía completa de integración](docs-html/docs/android/getting-started.html)
- [Repositorio oficial del SDK Android](https://github.com/FernandoGHe/kodenix-verify-otp-android)

## Desarrollo de documentación

```shell
npm install
npm run docs:build
npm run docs:check
```

Los Markdown son la fuente de verdad. `npm run docs:build` regenera `docs-html` y
`npm run docs:check` comprueba la guía Android contra el README rápido, las
coordenadas Maven, enlaces y símbolos esenciales documentados. Para compararla
además con un checkout local del SDK, defina `KODENIX_ANDROID_SDK_PATH` antes de
ejecutar la validación.

## Administración

- [Admin Portal Spec](docs-html/admin/admin-portal-spec.html)
- [Tenant License Configuration](docs-html/admin/tenant-license-configuration.html)

## Operaciones

- [Capacity Planning](docs-html/operations/capacity-planning.html)
- [Incident Response](docs-html/operations/incident-response.html)
- [Monitoring Alerts](docs-html/operations/monitoring-alerts.html)
- [Runbook](docs-html/operations/runbook.html)

## QA

- [Acceptance Criteria](docs-html/qa/acceptance-criteria.html)
- [QA Matrix](docs-html/qa/qa-matrix.html)
- [Test Cases](docs-html/qa/test-cases.html)

## Postman

- [Postman Collection](postman/kodenix-verify-otp-v2.postman_collection.json)

## Seguridad documental

Los valores incluidos en este repositorio son ejemplos de especificación. No forman parte del material autorizado: secretos reales, tokens productivos, credenciales de proveedores, llaves privadas o URLs internas sensibles.
