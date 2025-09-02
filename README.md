# 🚀 Generador de Prompts - Frontend Angular

## 📋 Descripción

Aplicación web moderna para generar prompts de IA de manera intuitiva y eficiente. Desarrollada con Angular 20, Material Design y arquitectura standalone.

## ✨ Características

- 🔐 **Autenticación JWT** con refresh tokens automáticos
- 🎨 **Interfaz moderna** con Material Design
- 📱 **Diseño responsivo** para todos los dispositivos
- 🔄 **Generación de prompts** con múltiples modelos de IA
- 💾 **Historial y favoritos** de prompts generados
- 🎯 **Categorización inteligente** de prompts
- ⚡ **Arquitectura standalone** de Angular 20

## 🛠️ Tecnologías

- **Frontend**: Angular 20.2.1
- **UI Framework**: Angular Material
- **Lenguaje**: TypeScript 5.9.2
- **Estado**: RxJS con BehaviorSubject
- **Autenticación**: JWT con HttpOnly cookies
- **Estilos**: CSS Grid + Flexbox + Material Design

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm 9+

### Pasos
```bash
# Clonar repositorio
git clone https://github.com/Biershoot/SaaS_generador_de_prompts_frontend.git
cd SaaS_generador_de_prompts_frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve

# Abrir en navegador
# http://localhost:4200
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios core (auth, config, error handling)
│   ├── features/             # Características (auth, prompts)
│   ├── pages/                # Páginas principales
│   ├── components/           # Componentes reutilizables
│   ├── guards/               # Guards de autenticación
│   ├── interceptors/         # Interceptores HTTP
│   └── shared/               # Componentes compartidos
├── assets/                   # Imágenes, iconos, estilos
└── environments/             # Configuración por ambiente
```

## 🔐 Autenticación

### Endpoints
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh` - Renovación de token
- `POST /auth/logout` - Cierre de sesión
- `GET /auth/validate` - Validación de token

### Estrategia de Seguridad
- **Access Token**: Almacenado en memoria (localStorage como fallback)
- **Refresh Token**: HttpOnly cookie para máxima seguridad
- **Interceptores**: Manejo automático de 401 y renovación de tokens
- **Guards**: Protección de rutas autenticadas

## 🎨 Componentes Principales

### Login Component
- Formulario de autenticación con validaciones
- Prueba de conectividad con backend
- Manejo de errores específicos por HTTP status
- Diseño Material Design responsivo

### Prompt Generator
- Generación de prompts con IA
- Historial de prompts generados
- Sistema de favoritos
- Categorización por tipo de contenido
- Contador de caracteres en tiempo real

### Dashboard
- Vista general del usuario
- Navegación a funcionalidades principales
- Estadísticas de uso

## 🔧 Configuración

### Variables de Entorno
```typescript
// environment.ts
export const environment = {
  production: false,
  api: 'http://localhost:8080'  // URL del backend
};
```

### CORS
El backend debe estar configurado para permitir:
- **Origen**: `http://localhost:4200`
- **Credenciales**: `true`
- **Métodos**: GET, POST, PUT, DELETE, OPTIONS

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: xs, sm, md, lg, xl
- **Grid System**: CSS Grid para layouts complejos
- **Flexbox**: Para alineaciones y espaciado

## 🧪 Testing

```bash
# Ejecutar tests unitarios
ng test

# Ejecutar tests e2e
ng e2e

# Generar reporte de cobertura
ng test --code-coverage
```

## 🚀 Build y Deploy

```bash
# Build de producción
ng build --configuration production

# Build con optimizaciones
ng build --optimization

# Analizar bundle
ng build --stats-json
npm run bundle-analyzer
```

## 📊 Scripts Disponibles

```bash
npm run start          # ng serve
npm run build          # ng build
npm run test           # ng test
npm run lint           # ng lint
npm run e2e            # ng e2e
npm run build:prod     # ng build --configuration production
```

## 🔍 Debugging

### Herramientas de Desarrollo
- **Angular DevTools**: Extensión del navegador
- **Console Logging**: Logs detallados en auth service
- **Network Tab**: Monitoreo de peticiones HTTP
- **Lighthouse**: Auditoría de performance

### Logs de Autenticación
```typescript
// Habilitar logs detallados
console.log('🔐 Login attempt:', credentials);
console.log('📡 Backend response:', response);
console.log('🔑 Token received:', token);
```

## 🚨 Solución de Problemas

### Error de Conexión Backend
1. Verificar que el backend esté corriendo en puerto 8080
2. Usar el botón "🔍 Probar Conexión Backend"
3. Revisar configuración CORS en el backend
4. Verificar logs de la consola del navegador

### Error de Autenticación
1. Verificar credenciales en el formulario
2. Revisar logs del auth service
3. Verificar que el backend esté funcionando
4. Comprobar configuración de cookies

### Problemas de Build
1. Limpiar cache: `npm run clean`
2. Reinstalar dependencias: `rm -rf node_modules && npm install`
3. Verificar versión de Node.js: `node --version`
4. Actualizar Angular CLI: `npm install -g @angular/cli@latest`

## 📈 Performance

### Optimizaciones Implementadas
- **Lazy Loading**: Carga diferida de módulos
- **OnPush Strategy**: Detección de cambios optimizada
- **TrackBy Functions**: Optimización de listas
- **Bundle Splitting**: Separación de código por rutas
- **Tree Shaking**: Eliminación de código no utilizado

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Seguridad

### Implementaciones
- **XSS Protection**: Sanitización de inputs
- **CSRF Protection**: Tokens en formularios
- **Content Security Policy**: Headers de seguridad
- **HTTPS Only**: En producción
- **Secure Cookies**: Configuración de cookies seguras

## 📚 Documentación Adicional

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👨‍💻 Autor

**Alejandro** - Desarrollador Full Stack

## 📞 Contacto

- **Email**: alejandropsn27@gmail.com
- **GitHub**: [@Biershoot](https://github.com/Biershoot)

---

**¡Gracias por usar nuestro Generador de Prompts! 🚀✨**
