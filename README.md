# assets/

Carpeta para iconos y recursos gráficos locales (logo, favicon, íconos SVG, etc.).

Las **fotos del equipo** y las **imágenes del proyecto** se cargan por URL desde
la base de datos, no van aquí. Cada `<img>` del HTML tiene `src=""` y un atributo
`data-img` que identifica el recurso:

| `data-img`         | Dónde aparece                         |
|--------------------|---------------------------------------|
| `hero-banner`      | Banner de portada (estilo Facebook)   |
| `logo`             | Logo (cabecera y pie)                 |
| `member-cesar`     | Foto de Cesar                         |
| `member-javier`    | Foto de Javier                        |
| `member-fernando`  | Foto de Fernando                      |
| `member-cristian`  | Foto de Cristian                      |
| `future`           | Imagen del proyecto "Mi Futuro"       |

## Cómo asignar una imagen desde la base de datos

```js
// La URL viene de tu consulta a la base de datos
L4F.setImage("member-cesar", "https://tu-bd.com/fotos/cesar.jpg");
L4F.setImage("hero-banner", "https://tu-bd.com/portada.jpg");
L4F.setImage("logo", "https://tu-bd.com/logo.png");
```

Al asignar una URL válida, el texto "Sube tu foto" desaparece automáticamente.
Si la URL falla, vuelve a mostrarse el marcador.
