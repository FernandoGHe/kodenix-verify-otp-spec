# AGENTS.md

## Alcance

Estas instrucciones aplican al repositorio de documentación
`kodenix-verify-otp-spec`.

## Arquitectura de repositorios

- La documentación y los contratos viven en `kodenix-verify-otp-spec`.
- Android vive en un repositorio privado independiente.
- iOS y Web tendrán repositorios independientes.
- No se utilizan monorepos ni submódulos.
- Cada SDK tiene su propio ciclo de versiones y releases.

Después de cambiar una API pública o publicar una versión de un SDK debe ejecutarse
una tarea separada de actualización documental en este repositorio. Opcionalmente,
`KODENIX_ANDROID_SDK_PATH` permite que `npm run docs:check` contraste la guía con
un checkout local del SDK Android.

## Cambios en API publica

Todo cambio en una API publica debe revisar y actualizar, cuando corresponda:

- la implementacion de todas las plataformas afectadas;
- los contratos en `sdk/`;
- los contratos OpenAPI en `openapi/`;
- la documentacion de integracion;
- los ejemplos y aplicaciones demo;
- las pruebas automatizadas y casos de QA;
- el changelog y el versionado de los artefactos.

La revision debe confirmar que ningun SDK movil contiene API keys privadas. Las apps
moviles reciben solamente `operationId` y un `sdkToken` temporal emitidos por el
backend del integrador.

## Documentacion generada

Los Markdown del repositorio son la fuente. No se editan manualmente los archivos de
`docs-html/`; se regeneran con `npm run docs:build` y se validan con
`npm run docs:check`.
