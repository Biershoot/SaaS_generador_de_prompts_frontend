# 🚀 PromptGenius - Generador de Prompts IA SaaS

<div align="center">

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Material Design](https://img.shields.io/badge/Material_Design-757575?style=for-the-badge&logo=material-design&logoColor=white)

**Una aplicación SaaS moderna y completa para generar prompts optimizados de IA con autenticación avanzada y diseño responsivo.**

[![Demo en Vivo](https://img.shields.io/badge/Demo_en_Vivo-1976D2?style=for-the-badge&logo=vercel&logoColor=white)](https://promptgenius-demo.vercel.app)
[![Documentación](https://img.shields.io/badge/Documentación-4CAF50?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://github.com/Biershoot/SaaS_generador_de_prompts_frontend/wiki)

</div>

---

## 🎯 ¿Qué Problemática Resuelve?

### 📺 **Para YouTubers y Creadores de Contenido**

**PromptGenius** nace de una necesidad real en la comunidad de creadores de contenido: **la dificultad para crear prompts efectivos y optimizados para videos de YouTube**.

#### **Problemas que Resuelve:**

🔴 **Falta de Tiempo**: Los YouTubers pasan horas escribiendo prompts manualmente para cada video, perdiendo tiempo valioso que podrían usar para crear contenido.

🔴 **Prompts Ineficientes**: Muchos creadores no saben cómo estructurar prompts para obtener los mejores resultados de las IAs, resultando en contenido de baja calidad.

🔴 **Falta de Organización**: No existe una forma sistemática de guardar, categorizar y reutilizar prompts exitosos para futuros videos.

🔴 **Dificultad Técnica**: La curva de aprendizaje para crear prompts efectivos es alta, especialmente para creadores sin experiencia técnica.

🔴 **Inconsistencia**: Cada video requiere prompts diferentes, pero no hay un sistema que mantenga la consistencia en el estilo y calidad.

#### **Solución que Ofrece:**

✅ **Generación Automática**: Crea prompts optimizados en segundos, no en horas.

✅ **Categorización Específica**: Prompts especializados para diferentes tipos de videos (tutoriales, reviews, entretenimiento, etc.).

✅ **Historial Inteligente**: Guarda y organiza todos tus prompts exitosos para reutilizarlos.

✅ **Optimización por IA**: Prompts diseñados específicamente para obtener los mejores resultados de ChatGPT, Claude, y otras IAs.

✅ **Interfaz Intuitiva**: Diseño simple y profesional que cualquier creador puede usar sin conocimientos técnicos.

---

## 📺 Descripción para YouTubers

**PromptGenius** es tu **asistente personal de IA** diseñado específicamente para **creadores de contenido de YouTube**. 

### **¿Qué Hace por Ti?**

🎬 **Genera Prompts para Videos**: Desde descripciones de video hasta guiones completos, prompts para thumbnails, y contenido para redes sociales.

🎯 **Optimiza tu Contenido**: Prompts diseñados para maximizar el engagement, mejorar el SEO, y aumentar las vistas de tus videos.

⏰ **Ahorra Tiempo**: Reduce el tiempo de creación de contenido de horas a minutos, permitiéndote enfocarte en lo que realmente importa: tu audiencia.

📊 **Organiza tu Trabajo**: Sistema de categorías y favoritos para mantener organizados todos tus prompts y reutilizarlos en futuros proyectos.

🚀 **Escala tu Canal**: Con prompts optimizados, podrás crear más contenido de calidad en menos tiempo, ayudando a tu canal a crecer más rápido.

### **Casos de Uso Específicos:**

- **📝 Descripciones de Video**: Genera descripciones optimizadas para SEO
- **🎨 Thumbnails**: Prompts para crear thumbnails atractivos
- **📋 Guiones**: Estructura y mejora tus guiones de video
- **🏷️ Tags**: Optimiza las etiquetas para mejor descubrimiento
- **📱 Redes Sociales**: Contenido para Instagram, Twitter, TikTok
- **📊 Análisis**: Prompts para analizar tendencias y competencia

---

## 📋 Tabla de Contenidos

- [🎯 ¿Qué Problemática Resuelve?](#-qué-problemática-resuelve)
- [📺 Descripción para YouTubers](#-descripción-para-youtubers)
- [✨ Características](#-características)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [🏗️ Arquitectura](#️-arquitectura)
- [🔐 Características de Seguridad](#-características-de-seguridad)
- [📱 Diseño Responsivo](#-diseño-responsivo)
- [🎨 Destacados de UI/UX](#-destacados-de-uiux)
- [📊 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Desarrollo](#-desarrollo)
- [📈 Rendimiento](#-rendimiento)
- [🤝 Contribución](#-contribución)

---

## ✨ Características

### 🎯 Funcionalidad Principal
- **Generación de Prompts IA**: Crea prompts optimizados para múltiples proveedores de IA (OpenAI, Claude, Gemini)
- **Categorización Inteligente**: Organiza prompts por categoría (Chat, Creativo, Negocios, Técnico, etc.)
- **Validación en Tiempo Real**: Contador de caracteres y validación de entrada con feedback instantáneo
- **Gestión de Historial**: Rastrea y gestiona todos los prompts generados
- **Sistema de Favoritos**: Guarda y organiza tus mejores prompts

### 🔐 Autenticación Avanzada
- **Seguridad basada en JWT**: Autenticación segura basada en tokens
- **Estrategia de Refresh Token**: Renovación automática de tokens con cookies HttpOnly
- **Protección de Rutas**: Rutas protegidas con control de acceso basado en roles
- **Gestión de Sesiones**: Sesiones de login persistentes con validación automática

### 📱 UI/UX Moderna
- **Diseño de Tema Oscuro**: Interfaz profesional oscura con Material Design
- **Diseño Responsivo**: Completamente responsivo en todos los dispositivos
- **Feedback en Tiempo Real**: Estados de carga, animaciones y notificaciones
- **Accesibilidad**: Compatible con WCAG y navegación por teclado

---

## 🛠️ Stack Tecnológico

### Frontend
- **Angular 20.2.1** - Framework reactivo moderno con componentes standalone
- **TypeScript 5.9.2** - Desarrollo con tipos seguros y configuración estricta
- **Angular Material** - Componentes UI profesionales y temas
- **RxJS** - Programación reactiva para gestión de estado
- **ESLint** - Calidad de código y consistencia

### Backend
- **Spring Boot 3.x** - Framework Java de nivel empresarial
- **Spring Security** - Framework de seguridad integral
- **Autenticación JWT** - Autenticación sin estado con tokens de renovación
- **Spring Data JPA** - Persistencia de datos y ORM
- **Base de Datos H2** - Base de datos en memoria para desarrollo

### DevOps y Herramientas
- **Git** - Control de versiones con commits convencionales
- **Angular CLI** - Herramientas de desarrollo y construcción
- **Iconos Material Design** - Iconografía consistente
- **Diseño Responsivo** - Enfoque mobile-first

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ y npm
- Java 17+ y Maven
- Git

### Configuración del Frontend
```bash
# Clonar el repositorio
git clone https://github.com/Biershoot/SaaS_generador_de_prompts_frontend.git
cd SaaS_generador_de_prompts_frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve

# Abrir http://localhost:4200
```

### Configuración del Backend
```bash
# Navegar al directorio del backend
cd backend

# Ejecutar con Maven
mvn spring-boot:run

# El backend estará disponible en http://localhost:8080
```

---

## 🏗️ Arquitectura

### Arquitectura del Frontend
```
src/
├── app/
│   ├── core/                 # Servicios y utilidades principales
│   │   ├── auth.service.ts   # Servicio de autenticación
│   │   ├── config.service.ts # Gestión de configuración
│   │   └── token.service.ts  # Manejo de tokens JWT
│   ├── components/           # Componentes reutilizables
│   │   └── prompt-generator/ # Generador de prompts principal
│   ├── pages/               # Componentes de página
│   │   ├── login/           # Páginas de autenticación
│   │   └── dashboard/       # Dashboard principal
│   ├── interceptors/        # Interceptores HTTP
│   ├── guards/              # Guardias de ruta
│   └── shared/              # Componentes compartidos
├── environments/            # Configuración de entorno
└── assets/                 # Activos estáticos
```

### Arquitectura de Seguridad
- **Tokens de Acceso JWT**: Almacenados en localStorage para llamadas API
- **Tokens de Renovación**: Cookies HttpOnly para renovación automática
- **Configuración CORS**: Solicitudes cross-origin seguras
- **Guardias de Ruta**: Rutas protegidas con verificaciones de autenticación
- **Interceptores HTTP**: Inyección automática de tokens y renovación

---

## 🔐 Características de Seguridad

### Flujo de Autenticación
1. **Login/Registro**: Validación segura de credenciales
2. **Generación de Tokens**: Par de tokens JWT de acceso + renovación
3. **Renovación Automática**: Renovación fluida de tokens
4. **Validación de Sesión**: Verificación de tokens en el backend
5. **Logout Seguro**: Limpieza de tokens y eliminación de cookies

### Mejores Prácticas de Seguridad
- ✅ Cookies HttpOnly para tokens de renovación
- ✅ Configuración CORS con credenciales
- ✅ Validación y sanitización de entrada
- ✅ Protección de rutas con guardias
- ✅ Headers HTTP seguros
- ✅ Manejo de expiración de tokens

---

## 📱 Diseño Responsivo

### Breakpoints
- **Desktop**: > 768px - Conjunto completo de características
- **Tablet**: 768px - Diseño optimizado
- **Mobile**: < 480px - Diseño mobile-first

### Características Móviles
- Interfaz táctil
- Gestos de deslizamiento para navegación
- Entradas de formulario optimizadas
- Navegación colapsable
- Tipografía responsiva

---

## 🎨 Destacados de UI/UX

### Sistema de Diseño
- **Material Design 3**: Últimas directrices de diseño
- **Tema Oscuro**: Interfaz profesional oscura
- **Espaciado Consistente**: Sistema de cuadrícula de 8px
- **Tipografía**: Familia de fuentes Roboto
- **Paleta de Colores**: Azul primario con colores semánticos

### Experiencia de Usuario
- **Estados de Carga**: Pantallas skeleton y spinners
- **Animaciones**: Transiciones suaves y micro-interacciones
- **Feedback**: Notificaciones toast y manejo de errores
- **Accesibilidad**: Etiquetas ARIA y navegación por teclado
- **Rendimiento**: Carga diferida y división de código

---

## 📊 Estructura del Proyecto

```
SaaS_generador_de_prompts_frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios principales
│   │   ├── components/              # Componentes reutilizables
│   │   ├── pages/                   # Componentes de página
│   │   ├── interceptors/            # Interceptores HTTP
│   │   ├── guards/                  # Guardias de ruta
│   │   └── shared/                  # Componentes compartidos
│   ├── environments/                # Configuraciones de entorno
│   └── assets/                      # Activos estáticos
├── docs/                           # Documentación
├── README.md                       # Este archivo
└── package.json                    # Dependencias
```

---

## 🔧 Desarrollo

### Calidad de Código
```bash
# Lint del código
npm run lint

# Corregir problemas de linting
npm run lint -- --fix

# Ejecutar tests
npm test

# Construir para producción
npm run build
```

### Flujo de Git
- **Commits Convencionales**: Mensajes de commit estructurados
- **Ramas de Características**: Desarrollo aislado
- **Pull Requests**: Proceso de revisión de código
- **Versionado Semántico**: Gestión de versiones

---

## 📈 Rendimiento

### Técnicas de Optimización
- **Carga Diferida**: División de código basada en rutas
- **Tree Shaking**: Eliminación de código no utilizado
- **Optimización de Bundle**: Construcciones comprimidas y minificadas
- **Estrategia de Caché**: Caché del navegador y service worker
- **Optimización de Imágenes**: Formato WebP y carga diferida

### Métricas de Rendimiento
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

## 🤝 Contribución

¡Bienvenimos las contribuciones! Por favor, consulta nuestras [Directrices de Contribución](CONTRIBUTING.md) para más detalles.

### Configuración de Desarrollo
1. Haz fork del repositorio
2. Crea una rama de característica
3. Realiza tus cambios
4. Añade tests si es aplicable
5. Envía un pull request

---

## 🙏 Agradecimientos

- **Equipo de Angular** por el increíble framework
- **Material Design** por el sistema de diseño
- **Spring Boot** por el robusto backend
- **OpenAI** por la inspiración de integración de IA

---

<div align="center">

**Construido con ❤️ por [Alejandro](https://github.com/Biershoot)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/alejandro-dev)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Biershoot)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://alejandro-portfolio.com)

</div>
