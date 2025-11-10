# Documentación de Peticiones API y Pantallas

Este documento describe las pantallas disponibles en la aplicación y dónde y cómo se realizan las peticiones HTTP (usando fetch).

## Pantallas Disponibles

La aplicación utiliza Next.js con el App Router. Las siguientes son las rutas principales (pantallas):

- **Inicio** (`/`) - Página principal (app/page.tsx)
- **Chat** (`/chat`) - Interfaz de chat (app/chat/)
- **Administrador** (`/admin`) - Panel de administración (app/admin/)
  - Sub-página: Nuevo producto (`/admin/productos/nuevo`)
- **Login** (`/login`) - Inicio de sesión (app/login/)
- **Buscar** (`/buscar`) - Página de búsqueda (app/buscar/)
- **Cuenta** (`/cuenta`) - Gestión de cuenta (app/cuenta/)
- **Perfil** (`/perfil`) - Perfil de usuario (app/perfil/)
- **Carrito** (`/carrito`) - Carrito de compras (app/carrito/)
- **Ofertas** (`/ofertas`) - Productos en oferta (app/ofertas/)
- **Pedidos** (`/pedidos`) - Gestión de pedidos (app/pedidos/)
- **Catálogo** (`/catalogo`) - Catálogo de productos (app/catalogo/)
- **Checkout** (`/checkout`) - Proceso de pago (app/checkout/)
- **Registro** (`/registro`) - Registro de usuarios (app/registro/)
- **Favoritos** (`/favoritos`) - Productos favoritos (app/favoritos/)
- **Productos** (`/productos`) - Lista de productos (app/productos/)
  - Sub-página: Detalle de producto (`/productos/[id]`)
- **Calendario** (`/calendario`) - Calendario (app/calendario/)
- **Categorías** (`/categorias`) - Categorías de productos (app/categorias/)
- **Notificaciones** (`/notificaciones`) - Notificaciones (app/notificaciones/)
- **Recuperar Contraseña** (`/forgot-password`) - Recuperación de contraseña (app/forgot-password/)
- **Historial de Órdenes** (`/historial-ordenes`) - Historial de pedidos (app/historial-ordenes/)

## Peticiones API

### Método de Realización

Todas las peticiones HTTP se realizan utilizando la función nativa `fetch` de JavaScript. No se utiliza axios u otras librerías.

### Configuración General

- **Base URL**: Definida en `process.env.NEXT_PUBLIC_API_URL` o por defecto `http://localhost:8080`
- **Credenciales**: Todas las peticiones incluyen `credentials: 'include'` para enviar cookies de sesión
- **Headers**: Se añaden headers como `Content-Type: application/json` cuando es necesario

### Función Genérica

En `lib/api.ts` se define una función genérica `api.fetch` que envuelve `fetch` y añade automáticamente las credenciales:

```typescript
fetch: async (url: string, options: RequestInit = {}) => {
  return await fetch(url, {
    credentials: 'include',
    ...options,
  });
}
```

### Endpoints Definidos

Los endpoints están organizados en `lib/api.ts` bajo el objeto `api`:

- **Auth**: registro, login, logout, verificar email
- **User**: obtener, actualizar usuario
- **Catalog**: obtener catálogo, buscar, ofertas, por categoría
- **Cart**: obtener, agregar, actualizar, eliminar productos, limpiar carrito
- **Categories**: CRUD de categorías
- **Favorites**: obtener, verificar, agregar, eliminar favoritos
- **Orders**: crear, obtener pedidos por usuario, obtener pedido específico

### Ubicaciones de Peticiones

Las peticiones se realizan en los siguientes archivos y contextos:

#### Páginas (app/)
- `app/registro/page.tsx`: Registro de usuario (`POST /api/usuarios/registro`)
- `app/catalogo/page.tsx`:
  - Obtener catálogo (`GET /api/catalogo`)
  - Verificar favoritos (`GET /api/favoritos/verificar/{id}`)
  - Agregar a favoritos (`POST /api/favoritos/{id}`)
  - Remover de favoritos (`DELETE /api/favoritos/{id}`)
  - Agregar al carrito (`POST /api/carrito/agregar-producto/{userId}`)
- `app/categorias/page.tsx`: Obtener categorías (`GET /api/categorias/obtener`) usando `api.fetch`
- `app/carrito/page.tsx`:
  - Obtener carrito (`GET /api/carrito/obtener/{userId}`)
  - Actualizar cantidad (`PUT /api/carrito/actualizar-cantidad/{userId}`)
  - Eliminar producto (`DELETE /api/carrito/eliminar-producto/{userId}`)
- `app/login/page.tsx`: Login (`POST /api/usuarios/login`)
- `app/ofertas/page.tsx`: Obtener ofertas (función `fetchOffers`)
- `app/productos/[id]/page.tsx`: Obtener producto específico (función `fetchProduct`)
- `app/admin/productos/nuevo/page.tsx`: Subir imagen (`POST /api/imagenes/subir`)

#### Librerías (lib/)
- `lib/auth.tsx`:
  - Login (`POST api.auth.login`)
  - Registro (`POST api.auth.register`)
  - Logout (`POST api.auth.logout`)
  - Verificar email (`GET api.auth.checkEmail`)
- `lib/catalogo.service.ts`: Servicios para catálogo usando fetch genérico
- `lib/carrito.ts`: Servicios para carrito usando fetch genérico
- `lib/comments.ts`: Comentarios de productos (`GET /product/{id}`, `POST`, etc.)
- `lib/user.ts`:
  - Obtener perfil (`GET /api/usuarios/perfil`)
  - Cambiar contraseña (`POST /api/usuarios/cambiar-password`)
  - Obtener cuenta (`GET /api/usuarios/cuenta`)
- `lib/categoria.ts`: Gestión de categorías con método `fetchAPI`
- `lib/products.ts`: Servicios de productos
- `lib/orders.service.ts`: Servicios de órdenes
- `lib/admin.ts`: Funciones administrativas
- `lib/services/carrito.services.ts`: Servicios adicionales de carrito

#### Hooks
- `hooks/use-notifications.ts`: Obtener notificaciones (`GET /api/notificaciones`) cada 30 segundos

### Patrones de Uso

1. **Directo con fetch**: La mayoría de las peticiones usan `fetch` directamente con URLs hardcodeadas o construidas
2. **Usando api.fetch**: Algunos usan la función genérica de `lib/api.ts`
3. **Servicios especializados**: Librerías como `categoria.ts` tienen métodos internos que usan fetch
4. **Hooks para polling**: `use-notifications.ts` usa intervalos para actualizar datos automáticamente

### Manejo de Errores

- Las respuestas se verifican con `response.ok`
- En caso de error, se lanzan excepciones o se muestran mensajes en consola
- Algunos lugares usan try/catch para manejar errores específicos

### Autenticación

Todas las peticiones incluyen cookies de sesión mediante `credentials: 'include'`, asumiendo que el backend maneja la autenticación basada en sesiones.