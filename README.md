# Farmacia Frontend

Frontend para el sistema de farmacia desarrollado con Next.js.

## Configuración inicial

1. Crear el archivo `.env.local` en la raíz del proyecto con la siguiente variable:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

2. Si estás desplegando en producción, cambia la URL a la dirección de tu backend en Render:
   ```env
   NEXT_PUBLIC_API_URL=https://tu-dominio-de-render.onrender.com
   ```

## Instalación

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Desarrollo

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

## Acceso a la API

Para acceder a la documentación interactiva de la API (Swagger), visita:

- En desarrollo: http://localhost:8080/swagger-ui.html
- En producción: https://tu-dominio-de-render.onrender.com/swagger-ui.html

## Problemas comunes

### Error de conexión al backend

1. Asegúrate de que el backend esté ejecutándose en el puerto 8080
2. Verifica que la URL en `.env.local` sea correcta
3. Comprueba que no haya problemas de CORS en el backend
4. Si estás usando Windows, asegúrate de que el firewall no esté bloqueando la conexión

### Credenciales de acceso

Para probar la aplicación, puedes usar las siguientes credenciales:
- Email: admin@farmacia.com
- Contraseña: admin123

O crea una nueva cuenta usando la página de registro.