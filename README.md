# cotiza-abogados

**Vía Legal** es un prototipo público para explorar servicios legales, consultar perfiles de ejemplo y probar una solicitud de cotización.

## Documentación

Consulta la [documentación del proyecto](docs/00%20-%20Inicio.md) para revisar sus tres fases, funcionalidades, pruebas y flujo de trabajo con Git.

## Vista previa

Abre `index.html` en un navegador. El prototipo usa HTML, CSS y JavaScript sin instalación ni conexión a servicios externos.

También puedes servir el directorio localmente con Python:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8000` para revisar la página.

Para probar los perfiles, entra en **Explorar → Abogados** o busca `Nicolas Herrera` desde la portada. Abre **Ver perfil** y luego **Solicitar cotización**. El formulario muestra el nombre del abogado y solo permite elegir sus modalidades de atención. Al terminar la prueba puedes volver a la ficha y seguir explorando con los filtros aplicados.

## Recorrido de la demo

1. Busca `sin coincidencias` para ver la ayuda, volver al buscador o recuperar la lista completa.
2. Busca `Nicolas Herrera` con modalidad **Presencial**. Selecciona **Quitar filtro de modalidad** para recuperar el perfil y conservar el nombre buscado.
3. Abre una ficha y completa una cotización. La confirmación muestra el destinatario y la modalidad seleccionada. Prueba también las confirmaciones de **Contacto**, **Iniciar sesión** y **Crear cuenta**.

Los formularios de cotización, contacto, inicio de sesión y registro son demostraciones. Usa datos ficticios. La foto opcional se previsualiza en memoria y se descarta al cerrar el formulario. El sitio no guarda contraseñas ni envía los datos.
