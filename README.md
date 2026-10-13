# Laundry Customer Portal

Portal web para clientes de **Lavandería Kyo**, construido con [Angular](https://angular.dev) 20. Permite a los clientes y administradores gestionar guías de recolección, facturas, reportes y usuarios desde un panel centralizado.

## Características principales

- **Autenticación**: inicio de sesión, activación de cuenta, recuperación y restablecimiento de contraseña.
- **Dashboard**: vista general con indicadores clave (KPIs) del negocio.
- **Guías de recolección** (*pickup guides*): listado, detalle, evidencias fotográficas y revisiones.
- **Facturas** (*invoices*): listado y detalle de facturación.
- **Reportes**: resumen general, por servicio e histórico.
- **Gestión de usuarios**: listado y formulario de alta/edición, con control de acceso basado en permisos.
- **Control de acceso**: guards de autenticación y de permisos (`auth.guard`, `permission.guard`) que protegen las rutas según el rol del usuario.

## Stack tecnológico

- [Angular](https://angular.dev) 20 (standalone components, lazy loading por ruta)
- [Angular Material](https://material.angular.dev) + [Angular CDK](https://material.angular.dev/cdk/categories)
- [RxJS](https://rxjs.dev)
- [Chart.js](https://www.chartjs.org/) a través de [ng2-charts](https://valor-software.com/ng2-charts/) para visualización de datos en los reportes
- [Karma](https://karma-runner.github.io) + [Jasmine](https://jasmine.github.io/) para pruebas unitarias
- TypeScript

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- [Angular CLI](https://angular.dev/tools/cli) (opcional, se puede usar vía `npx`)

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/pacoyx/Laundry.CustomerPortal.git
cd Laundry.CustomerPortal
npm install
```

## Configuración

La URL base de la API se define en los archivos de entorno:

- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5239/api/customer-portal'
};
```

Ajusta `apiUrl` según el entorno donde se despliegue el backend.

## Desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
npm start
```

o directamente con Angular CLI:

```bash
ng serve
```

Por defecto, la aplicación se sirve en `http://localhost:4301/` (puerto configurado en `angular.json`). Se recargará automáticamente al modificar los archivos fuente.

## Compilación (build)

Para compilar el proyecto en modo producción:

```bash
npm run build
```

Los artefactos de la compilación se almacenan en el directorio `dist/`.

Para compilar en modo desarrollo con recompilación continua:

```bash
npm run watch
```

## Pruebas unitarias

Para ejecutar las pruebas unitarias con [Karma](https://karma-runner.github.io):

```bash
npm test
```

## Estructura del proyecto

```
src/app/
├── auth/                 # Login, activación, recuperación y restablecimiento de contraseña
├── core/
│   ├── guards/            # Guards de autenticación y permisos
│   ├── interceptors/      # Interceptores HTTP (auth, envelope de respuesta)
│   ├── models/            # Modelos/DTOs de dominio
│   └── services/          # Servicios de acceso a la API
├── dashboard/             # Panel principal con KPIs
├── invoices/              # Listado y detalle de facturas
├── layout/                # Layout principal, header y sidebar
├── pickup-guides/         # Listado y detalle de guías de recolección (evidencias, revisiones)
├── reports/               # Reportes: resumen, por servicio e histórico
├── shared/                # Componentes, pipes, utilidades y validadores compartidos
└── users/                 # Listado y formulario de gestión de usuarios
```

## Scripts disponibles

| Script          | Descripción                                             |
|-----------------|----------------------------------------------------------|
| `npm start`     | Inicia el servidor de desarrollo (`ng serve`)             |
| `npm run build` | Compila la aplicación para producción                    |
| `npm run watch` | Compila en modo desarrollo con recompilación continua     |
| `npm test`      | Ejecuta las pruebas unitarias con Karma                   |

## Licencia

Este proyecto es software propietario de **Lavandería Kyo**. Todos los derechos reservados. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

## Recursos adicionales

Para más información sobre Angular CLI, incluyendo referencias de comandos detalladas, visita la [documentación oficial de Angular CLI](https://angular.dev/tools/cli).
