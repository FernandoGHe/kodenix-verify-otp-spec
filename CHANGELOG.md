# Changelog

## Unreleased

- Reorganizada la guía Android como integración headless, Views/XML y Compose.
- Añadidos ejemplos completos de Activity Result API y compatibilidad Java legacy.
- Aclarados constructores Java posicionales desde Kotlin y los códigos mock reales de las demos.
- Añadida validación de mojibake en las fuentes Markdown públicas.

- Documentadas dependencias transitivas y declaraciones Gradle mínimas para cada integración Android.
- Aclarado que Views no incluye KTX y que Views con coroutines requiere ambos artefactos.
- Recomendada una única versión coordinada para todos los artefactos Kodenix Android.

- Documentada la fachada única Android `KodenixOtp.create(...)` para HTTP y mock configurable.
- Documentados transporte HTTP, identidad automática de la app instalada y cancelación de conexión.
- Completados en OpenAPI los cinco headers Android y los enums wire de status/error/action.

- Mejorado el contraste de Swagger UI en modo oscuro para modelos, rutas y operaciones expandidas, incluidos parámetros, request body, código, selects y respuestas.
- Documentada la semántica de entrega asíncrona y el webhook `otp.delivery_failed`.

- Documentados targets opcionales, matriz canal/target y validaciones del mock.
- Aclarado que Views y Compose respetan el canal preferido y que la captura interna de target sigue pendiente.
- Documentado el escenario actual de la demo (`2468`, longitud 4, cooldown 10, tres intentos).

- Documentada la arquitectura Android 0.1.0 de cuatro artefactos.
- Documentado el flujo mock funcional para Java, Kotlin, Views y Compose.
- Sustituido el estado anterior de transporte pendiente por la integración HTTP real mediante la fachada única.
- Registrada la discrepancia de headers de identidad Android en el OpenAPI público.
- Aclarados cancelación, seguridad, licenciamiento, fallback y errores Android.
