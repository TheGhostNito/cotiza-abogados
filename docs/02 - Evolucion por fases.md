# Evolución por fases

← [Volver al inicio](00%20-%20Inicio.md)

## Fase 1 — Frontend inicial

Se construyó la página completa como prototipo estático: identidad visual, portada, navegación, directorio de seis especialidades, vista de abogados de ejemplo, buscador, filtro por modalidad, sección “Cómo funciona” y formulario de contacto.

También se incorporaron los diálogos de inicio de sesión, registro y cotización. El registro incluyó selección, validación y vista previa local de fotografía. Desde esta fase se dejó claro que las cuentas, solicitudes y mensajes eran demostraciones y que la información no se guardaba ni enviaba.

**Commit:** `bc571e6` — *Fase 1 - Frontend inicial de Via Legal*.

## Fase 2 — Perfiles y cotización por abogado

La exploración de abogados pasó de tarjetas genéricas a tres perfiles ficticios con fotografía, especialidad, años de experiencia, descripción y modalidad de atención. Se agregó una ficha individual y un flujo de cotización asociado al abogado seleccionado.

El formulario identifica al destinatario, restringe la modalidad a las opciones disponibles en su perfil y permite volver a la ficha después de completar la cotización. El buscador y los filtros se mantuvieron dentro del flujo.

**Commit:** `c29a1b` — *Fase 2 - Perfiles de abogados y cotizacion por perfil*.

## Fase 3 — Mejoras finales

Se refinó la experiencia de cierre: estados sin resultados con ayuda contextual, opción de editar la búsqueda, recuperación de resultados quitando solo el filtro de modalidad y mensajes de confirmación más claros.

Además, se mejoraron la navegación por foco, el comportamiento del menú, la presentación de los resultados de formularios, la confirmación de la modalidad cotizada y la adaptación a pantallas pequeñas. El contacto quedó con un estado de éxito separado y opción para escribir otro mensaje.

**Commit:** `4d71353` — *Fase 3 - Mejoras finales de Via Legal*.

Continúa en [Funcionalidades actuales](03%20-%20Funcionalidades%20actuales.md).
