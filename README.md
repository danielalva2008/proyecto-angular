# Proyecto Angular

Este es un proyecto Angular 19 con standalone components.

## Estructura del proyecto

```
src/
├── app/
│   ├── components/      # Componentes de la aplicación
│   ├── directives/      # Directivas personalizadas
│   ├── guards/         # Guards de rutas
│   ├── models/         # Interfaces y modelos
│   ├── pipes/          # Pipes personalizados
│   ├── services/       # Servicios
│   ├── app.component.* # Componente raíz
│   ├── app.config.ts   # Configuración de la aplicación
│   └── app.routes.ts   # Definición de rutas
├── assets/             # Archivos estáticos
├── environments/       # Configuraciones de entorno
├── index.html          # Página principal
├── main.ts             # Punto de entrada
└── styles.scss         # Estilos globales
```

## Iniciar el proyecto

```bash
npm install
ng serve
```

## Construir para producción

```bash
ng build --configuration production
```

## Ejecutar pruebas

```bash
ng test
```