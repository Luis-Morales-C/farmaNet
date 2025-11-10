# FRONTEND — Cambios y Mapa de Integración con API

Este documento resume los endpoints que el front utiliza actualmente, los endpoints del backend que aún no están conectados, las discrepancias detectadas, la estrategia de autenticación/credenciales esperada por el frontend, los archivos modificados y recomendaciones para el backend (CORS/cookies/tokens).

---

## Plan breve
- Listar endpoints usados por el frontend (método + ruta completa).
- Listar endpoints del `API_ROUTES.md` que no están siendo consumidos.
- Señalar discrepancias detectadas y acciones recomendadas.
- Explicar estrategia de autenticación/credenciales que el frontend espera.
- Tabla con archivos modificados y propósito.
- Recomendaciones prácticas para el backend.

---

## 1) Endpoints que el frontend usa actualmente
(Obtenidos desde `lib/api.ts` y uso en los servicios/páginas)

Nota: `API_BASE_URL` proviene de `process.env.NEXT_PUBLIC_API_URL` (por defecto `http://localhost:8080`).

- Auth
  - POST `POST ${API_BASE_URL}/api/auth/registro` — registrar usuario
  - POST `POST ${API_BASE_URL}/api/auth/login` — login
  - POST `POST ${API_BASE_URL}/api/auth/logout` — logout

- Usuario
  - GET `GET ${API_BASE_URL}/api/usuarios/{id}` — obtener usuario por id (usado en perfiles)
  - PUT `PUT ${API_BASE_URL}/api/usuarios/{id}` — actualizar usuario
  - PUT `PUT ${API_BASE_URL}/api/usuarios/cambiar-password` — cambio de contraseña
  - DELETE `DELETE ${API_BASE_URL}/api/usuarios/cuenta` — eliminar cuenta
  - GET `GET ${API_BASE_URL}/api/usuarios/existe/{email}` — verificar existencia de email

- Productos
  - GET `GET ${API_BASE_URL}/api/productos` — listar productos (con query params)
  - GET `GET ${API_BASE_URL}/api/productos/{id}` — obtener producto por id
  - GET `GET ${API_BASE_URL}/api/productos/categoria/{categoriaId}` — productos por categoría

- Catálogo
  - GET `GET ${API_BASE_URL}/api/catalogo` — catálogo completo
  - GET `GET ${API_BASE_URL}/api/catalogo/buscar?nombre=...` — búsqueda en catálogo
  - GET `GET ${API_BASE_URL}/api/catalogo/ofertas` — ofertas (nota: ver discrepancia)
  - GET `GET ${API_BASE_URL}/api/catalogo/categoria/{id}` — catálogo por categoría

- Carrito
  - GET `GET ${API_BASE_URL}/api/carrito` — obtener carrito del usuario
  - POST `POST ${API_BASE_URL}/api/carrito/agregar` — agregar item (body: productoId, cantidad)
  - POST `POST ${API_BASE_URL}/api/carrito/actualizar` — actualizar cantidad (body: productoId, cantidad)
  - POST `POST ${API_BASE_URL}/api/carrito/eliminar` — eliminar item (body: productoId)
  - GET `GET ${API_BASE_URL}/api/carrito/resumen` — resumen del carrito

- Categorías
  - GET `GET ${API_BASE_URL}/api/categorias/obtener` — todas las categorías activas
  - GET `GET ${API_BASE_URL}/api/categorias/raiz` — categorías raíz
  - GET `GET ${API_BASE_URL}/api/categorias/subcategorias/{categoriaPadreId}` — subcategorías
  - GET `GET ${API_BASE_URL}/api/categorias/buscar?nombre=...` — buscar categorías

- Favoritos
  - GET `GET ${API_BASE_URL}/api/favoritos` — obtener favoritos del usuario
  - GET `GET ${API_BASE_URL}/api/favoritos/conteo` — conteo (implementación: `api.favorites.getAll + '/conteo'`)
  - GET `GET ${API_BASE_URL}/api/favoritos/verificar/{productoId}` — verificar favorito
  - POST `POST ${API_BASE_URL}/api/favoritos/{productoId}` — agregar favorito
  - DELETE `DELETE ${API_BASE_URL}/api/favoritos/{productoId}` — eliminar favorito

- Pedidos
  - POST `POST ${API_BASE_URL}/api/pedidos/crear` — crear pedido
  - GET `GET ${API_BASE_URL}/api/pedidos/usuario/{usuarioId}` — pedidos por usuario
  - GET `GET ${API_BASE_URL}/api/pedidos/{orderId}` — pedido por id

- Notificaciones
  - GET `GET ${API_BASE_URL}/api/notificaciones` — listar notificaciones
  - GET `GET ${API_BASE_URL}/api/notificaciones/no-leidas` — conteo no leídas
  - PUT `PUT ${API_BASE_URL}/api/notificaciones/{id}/marcar-leida` — marcar como leída
  - PUT `PUT ${API_BASE_URL}/api/notificaciones/marcar-todas-leidas` — marcar todas
  - DELETE `DELETE ${API_BASE_URL}/api/notificaciones/{id}` — eliminar notificación

- Comentarios (nota: revisar existencia en backend)
  - GET `GET ${API_BASE_URL}/api/comments/product/{productId}` — comentarios por producto
  - POST `POST ${API_BASE_URL}/api/comments` — crear comentario
  - POST/PUT `POST/PUT ${API_BASE_URL}/api/comments/{id}/helpful` — marcar útil (implementación front: `/helpful`)

> Observación: donde especifico `{usuarioId}` o `{id}` el frontend a veces espera que el backend pueda identificar al usuario por sesión/cookie (no enviar userId en URL). En el código actual la estrategia es usar `GET /api/carrito` (sin userId en URL) porque `api.fetch` incluye `credentials: 'include'`.

---

## 2) Endpoints del `API_ROUTES.md` que el frontend todavía NO usa
(Los endpoints listados en la documentación del backend pero sin uso actual en el front)

- Calendario Controller
  - GET/POST/PUT/DELETE `/api/calendario/eventos`

- Chat Controller
  - GET `/api/chat`
  - POST `/api/chat/enviar`

- Filtro Controller
  - POST `/api/filtro/productos`

- Inventario Controller
  - `/api/inventario` (GET/POST/PUT/DELETE y subroutes)

- Pago Controller
  - POST `/api/pagos/checkout`
  - GET `/api/pagos/{id}`

- Venta Controller
  - `/api/ventas` y subroutes (reportes, métricas, CRUD)

- Oferta Controller (si el backend expone `/api/ofertas` en lugar de `/api/catalogo/ofertas`) — ver discrepancia

- Utilitarios / pruebas
  - GET `/api/categorias/test`

- Posible: `/api/catalogo/productos/{id}` (en doc) — front usa `/api/productos/{id}`; confirmar.

---

## 3) Discrepancias detectadas (acciones recomendadas)

- RUTA DE OFERTAS
  - Front: usa `GET ${API_BASE_URL}/api/catalogo/ofertas` (`api.catalog.offers`).
  - Backend doc: expone `/api/ofertas` (controller `Oferta Controller`).
  - Recomendación: confirmar cuál es la ruta oficial. Si el backend usa `/api/ofertas`, actualizar `lib/api.ts` y los llamados a `api.catalog.offers` a `/api/ofertas`. Alternativamente crear alias `api.offers.controller` + `api.catalog.offers` para soportar ambos.

- PRODUCT-BY-ID (catalogo vs productos)
  - Backend doc: `GET /api/catalogo/productos/{id}`.
  - Front: actualmente usa `GET /api/productos/{id}` (via `api.products.get(id)`).
  - Recomendación: confirmar cuál de las dos es correcta. Si el backend expone sólo la ruta bajo `catalogo`, añadir `api.catalog.getProduct(id)` y cambiar las llamadas en `app/productos/[id]`.

- COMMENTS
  - `lib/api.ts` declara rutas `/api/comments/...` pero `API_ROUTES.md` no lista comentarios. Confirmar si el backend implementa comentarios; si no, eliminar o desactivar el código de comentarios en frontend.

- USER IDENTIFICATION IN CART
  - El frontend fue convenientemente modificado para llamar a `GET /api/carrito` y `GET /api/carrito/resumen` (sin userId en la URL), suponiendo que el backend identifica al usuario por cookie o token. Si tu backend requiere `usuarioId` en la URL/body, actualizar frontend para mandar el campo necesario o ajustar backend para usar session/JWT.

---

## 4) Estrategia de autenticación y credenciales que el frontend espera

- `api.fetch(...)` (central) añade `credentials: 'include'` a todas las peticiones. Por tanto el frontend espera que el backend use sesiones basadas en cookies (o que las cookies importantes—como `JSESSIONID` o cookies de sesión—se envíen y se lean en el servidor).

- Adicionalmente, en varios puntos el frontend guarda un `auth-token` en `localStorage` y añade manualmente el header `Authorization: Bearer ${token}` en llamadas concretas. Actualmente el código mezcla dos estrategias:
  1. Cookie-based session (preferred por `credentials: 'include'`) — el frontend confía en cookies para identificar usuario en endpoints como `/api/carrito`.
  2. Token-based (Bearer stored en localStorage) — usado en lugares donde el código añade `Authorization` manualmente.

- Recomendación: elegir y estandarizar una sola estrategia de autenticación:
  - Opción A (recomendada for this project): Session cookies + `credentials: 'include'` + CSRF token handling.
  - Opción B: JWT en `Authorization` header; si se adopta este modo, `credentials: 'include'` deja de ser requisito obligatorio y el frontend debería enviar el header en todas las peticiones autenticadas.

- CSRF: si se usan cookies de sesión, habilitar envío y validación de CSRF token (o proteger endpoints sensibles), o desactivar CSRF para las rutas API (no recomendado en producción).

---

## 5) Tabla: archivos modificados y propósito

| Archivo | Propósito del cambio |
|---|---|
| `lib/api.ts` | Centraliza todas las rutas del backend y expone `api.fetch(url, options)` que añade `credentials: 'include'`. Punto único para actualizar rutas. |
| `lib/auth.tsx` | Usos de login/register/logout centralizados en `api.auth.*` y manejo de token/localStorage. |
| `lib/user.ts` | Reemplazo de fetchs hardcodeadas por `api.fetch(api.user.*)`. Manejo de update/profile/change-password/delete account. |
| `lib/carrito.ts` | Unificó las llamadas al carrito (ahora usa `/api/carrito`, `/api/carrito/agregar`, etc.) y eliminó userId en URL (espera sesión). |
| `lib/services/carrito.services.ts` | Servicio auxiliar del carrito actualizado para usar `api.fetch`. |
| `lib/products.ts` | Ajuste de apiCall para usar URL completa si endpoint empieza con `http`; mapping de list/get. |
| `lib/catalogo.service.ts` | Llamadas a endpoints de catálogo usando `api.catalog.*`. |
| `lib/categoria.ts` | Migración a `api.categories.*` para obtener categorías y subcategorías. |
| `lib/comments.ts` | Migrado a `api.comments.*` (chequear existencia backend). |
| `lib/orders.service.ts` | Usos de `api.orders.*` (crear pedido, obtener pedidos). |
| `lib/admin.ts` | Creación/obtención de productos y categorías del admin ahora usan `api.*`. |
| `hooks/use-notifications.tsx` | Usa `api.notifications.*` y `api.fetch` (incluye credentials). |
| `hooks/use-favorites.tsx` | Cambiado a `api.favorites.*` y `api.fetch`; corregidos errores de sintaxis. |
| `app/catalogo/page.tsx` | Migrado para usar `api.catalog.getAll` y `api.favorites`/`api.cart` en ProductCard. |
| `app/productos/[id]/page.tsx` | Cambiado para usar `api.products.get(id)` (o `api.catalog.getProduct` si se ajusta). |
| `app/login/page.tsx`, `app/registro/page.tsx`, `app/cuenta/page.tsx` | Usan `api.auth.*` para login/registro/logout. |
| `components/header.tsx` | ahora usa `api.cart.get` para el recuento del carrito. |

---

## 6) Recomendaciones concretas para backend (CORS / cookies / autenticación)

1. CORS (esencial para `credentials: 'include'` desde distinto origen):
   - Habilitar CORS con `Access-Control-Allow-Origin` apuntando al origen del frontend (p. ej. `http://localhost:3000` en desarrollo) **no** usar `*` cuando `allowCredentials` es true.
   - `Access-Control-Allow-Credentials: true`
   - `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
   - `Access-Control-Allow-Headers`: incluir `Content-Type`, `Authorization`, `X-CSRF-TOKEN` si aplica.

   Ejemplo de configuración (Spring Boot): registrar un `CorsConfigurationSource` y activar `http.cors().configurationSource(...)`.

2. Cookies y SameSite
   - Si frontend y backend están en dominios distintos (o puertos distintos), asegurar que la cookie de sesión tenga: `SameSite=None; Secure; HttpOnly`.
   - En `application.properties`/`application.yml` de Spring Boot (opciones):
     - `server.servlet.session.cookie.http-only=true`
     - `server.servlet.session.cookie.secure=true` (en producción con https)
     - `server.servlet.session.cookie.same-site=None`

3. CSRF
   - Si se usa cookie-based session, habilitar manejo de CSRF (enviar token CSRF al cliente o exponer endpoint para obtenerlo) y exigir header `X-CSRF-TOKEN` en mutating requests.
   - Alternativamente para APIs REST, considerar usar tokens JWT y desactivar CSRF para endpoints que sólo aceptan Bearer tokens.

4. Unificar estrategia de autenticación
   - Recomendación: elegir entre session cookies OR JWT Bearer. Actualmente el frontend mezcla ambos. Preferible: session cookies + CSRF token para UX con `credentials: 'include'`.

5. Subir imágenes (multipart)
   - Asegurar que el endpoint de subida acepta `multipart/form-data` sin `Content-Type` fijo (el browser asigna boundary). Los handlers en backend deben usar `@RequestPart` / `MultipartFile`.

6. Respaldar y documentar endpoints faltantes
   - Si vas a exponer entidades como calendario, inventario, pagos y ventas (mencionadas en `API_ROUTES.md`), documenta payloads y errores esperados (códigos HTTP y esquema de respuesta) y añade rutas en `lib/api.ts` para que el frontend pueda integrarlas fácilmente.

---

## 7) Acciones recomendadas / próximos pasos (prioritizado)

1. Backend: confirmar rutas de `ofertas` y `catalogo/productos/{id}`. Si difieren, actualiza `lib/api.ts` o añade alias.
2. Decidir estrategia de autenticación (cookies sessions vs JWT). Si eliges cookies:
   - Aplicar configuración CORS con allowCredentials=true.
   - Establecer `SameSite=None; Secure` en cookies para cross-site.
   - Implementar CSRF token flow (preferible) o un mecanismo seguro para mutating requests.
3. Si quieres usar `comments` habilítalos en el backend o elimina el código de frontend para evitar 404s.
4. Si necesitas integrar pagos, inventario, ventas o calendario, crear servicios frontend parecidos a `lib/orders.service.ts` y mapear rutas en `lib/api.ts`.
5. Ejecutar pruebas manuales: login -> verificar `Set-Cookie` en respuesta; luego GET `/api/carrito` y comprobar que la petición lleva Cookie en Request y el backend reconoce la sesión.

---

Si quieres, aplico ahora cualquiera de las correcciones menores propuestas (por ejemplo: añadir alias para `/api/ofertas` y `api.catalog.getProduct`) y vuelvo con una verificación automática (búsqueda global y reporte). ¿Cuál prefieres que haga primero?


