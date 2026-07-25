# Manifest - Kodenix Verify OTP

- [CHANGELOG.md](CHANGELOG.md)

Inventario del paquete de especificación.

## Documentación principal

- [docs/00-documentation-governance.md](docs/00-documentation-governance.md)
- [docs/01-functional-scope.md](docs/01-functional-scope.md)
- [docs/02-requirements.md](docs/02-requirements.md)
- [docs/03-licensing-and-usage-control.md](docs/03-licensing-and-usage-control.md)
- [docs/04-transaction-counting-and-billing.md](docs/04-transaction-counting-and-billing.md)
- [docs/05-security-specification.md](docs/05-security-specification.md)
- [docs/06-fallback-and-channel-availability.md](docs/06-fallback-and-channel-availability.md)
- [docs/07-api-contract-overview.md](docs/07-api-contract-overview.md)
- [docs/08-state-machine.md](docs/08-state-machine.md)
- [docs/09-data-model.md](docs/09-data-model.md)
- [docs/10-infrastructure-sizing.md](docs/10-infrastructure-sizing.md)
- [docs/11-observability-audit.md](docs/11-observability-audit.md)
- [docs/12-error-catalog.md](docs/12-error-catalog.md)
- [docs/13-webhooks.md](docs/13-webhooks.md)
- [docs/14-sla-and-availability.md](docs/14-sla-and-availability.md)
- [docs/15-release-versioning.md](docs/15-release-versioning.md)
- [docs/16-published-documentation-surface.md](docs/16-published-documentation-surface.md)
- [docs/android/getting-started.md](docs/android/getting-started.md)

## OpenAPI / Swagger

- [openapi/admin-api.yaml](openapi/admin-api.yaml)
- [openapi/analytics-api.yaml](openapi/analytics-api.yaml)
- [openapi/licensing-api.yaml](openapi/licensing-api.yaml)
- [openapi/otp-public-api.yaml](openapi/otp-public-api.yaml)
- [openapi/provider-internal-api.yaml](openapi/provider-internal-api.yaml)
- [openapi/webhooks-api.yaml](openapi/webhooks-api.yaml)
- [openapi/README.md](openapi/README.md)
- [Swagger UI](swagger-ui/)

## Diagramas

- [diagrams/README.md](diagrams/README.md)
- [diagrams/component.mmd](diagrams/component.mmd)
- [diagrams/deployment.mmd](diagrams/deployment.mmd)
- [diagrams/erd-licensing.mmd](diagrams/erd-licensing.mmd)
- [diagrams/outage-flow.mmd](diagrams/outage-flow.mmd)
- [diagrams/security-token-flow.mmd](diagrams/security-token-flow.mmd)
- [diagrams/sequence-enterprise-license.mmd](diagrams/sequence-enterprise-license.mmd)
- [diagrams/sequence-provider-fallback.mmd](diagrams/sequence-provider-fallback.mmd)
- [diagrams/sequence-sdk-init-target-optional.mmd](diagrams/sequence-sdk-init-target-optional.mmd)
- [diagrams/state-machine.mmd](diagrams/state-machine.mmd)

## Backend handoff

- [backend/backend-handoff.md](backend/backend-handoff.md)
- [backend/database-model.md](backend/database-model.md)
- [backend/domain-model.md](backend/domain-model.md)
- [backend/provider-contract.md](backend/provider-contract.md)
- [backend/rules-engine.md](backend/rules-engine.md)

## SDK contracts

- [sdk/localization-spec.md](sdk/localization-spec.md)
- [sdk/sdk-android-contract.md](sdk/sdk-android-contract.md)
- [sdk/sdk-contract-common.md](sdk/sdk-contract-common.md)
- [sdk/sdk-ios-contract.md](sdk/sdk-ios-contract.md)
- [sdk/sdk-web-contract.md](sdk/sdk-web-contract.md)
- [sdk/ui-ux-spec.md](sdk/ui-ux-spec.md)
## Implementaciones externas

- Android: SDK headless, UI Compose y aplicación demostrativa en un repositorio
  independiente; este repositorio mantiene únicamente su contrato y documentación.
- iOS y Web se publicarán en repositorios independientes.

No se utilizan submódulos ni se copia código de SDK dentro de este repositorio.

## Tooling documental

- [scripts/build-docs.mjs](scripts/build-docs.mjs)
- [scripts/verify-docs.mjs](scripts/verify-docs.mjs)
- [package.json](package.json)

## Admin

- [admin/admin-portal-spec.md](admin/admin-portal-spec.md)
- [admin/tenant-license-configuration.md](admin/tenant-license-configuration.md)

## Operaciones

- [operations/capacity-planning.md](operations/capacity-planning.md)
- [operations/incident-response.md](operations/incident-response.md)
- [operations/monitoring-alerts.md](operations/monitoring-alerts.md)
- [operations/runbook.md](operations/runbook.md)

## QA

- [qa/acceptance-criteria.md](qa/acceptance-criteria.md)
- [qa/qa-matrix.md](qa/qa-matrix.md)
- [qa/test-cases.md](qa/test-cases.md)

## Postman

- [postman/kodenix-verify-otp-v2.postman_collection.json](postman/kodenix-verify-otp-v2.postman_collection.json)

