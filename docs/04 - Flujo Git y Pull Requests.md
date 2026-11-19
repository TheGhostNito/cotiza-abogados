# Flujo Git y Pull Requests

← [Volver al inicio](00%20-%20Inicio.md)

El desarrollo se organizó con dos ramas:

- **`dev`:** recibió el commit de cada fase.
- **`main`:** recibió cada fase mediante un Pull Request desde `dev`.

Al terminar el trabajo, `dev` quedó en el commit de la Fase 3 (`4d71353`) y `main` en el merge del PR #3 (`2ebeb1b`). El historial local muestra esta secuencia del **19 de noviembre de 2026**:

| Hora (Chile) | Rama / acción | Commit | Resultado |
|---|---|---|---|
| 13:01 | Inicio | `a5c975a` | Commit inicial |
| 14:04 | `dev` | `bc571e6` | Fase 1 completada |
| 14:23 | Merge a `main` | `4292e5c` | [Pull Request #1](https://github.com/TheGhostNito/cotiza-abogados/pull/1) |
| 14:38 | `dev` | `c29a1b` | Fase 2 completada |
| 14:40 | Merge a `main` | `a6f6980` | [Pull Request #2](https://github.com/TheGhostNito/cotiza-abogados/pull/2) |
| 14:52 | `dev` | `4d71353` | Fase 3 completada |
| 14:56 | Merge a `main` | `2ebeb1b` | [Pull Request #3](https://github.com/TheGhostNito/cotiza-abogados/pull/3) |

Los tres merges conservan en Git el origen `TheGhostNito/dev` y los títulos de cada fase. El historial local no registra detalles sobre revisores, comentarios o controles automáticos de los PR, por lo que no se documentan como realizados.
