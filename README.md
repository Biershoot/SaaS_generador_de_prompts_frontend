# 🎬 Prompts Genius — Generador de Prompts para YouTubers (Frontend Angular)

## 📌 ¿Qué problemática resuelve?
Los creadores de contenido en YouTube gastan mucho tiempo pensando títulos, descripciones, ganchos, ideas de miniaturas y llamados a la acción. Además, es difícil mantener un estilo consistente y optimizado para SEO en cada video.

**Prompts Genius** resuelve este problema generando prompts profesionales y listos para usar con modelos de IA (OpenAI, Claude, Gemini, etc.) enfocados específicamente en contenido de YouTube: títulos irresistibles, descripciones SEO, capítulos/temporalidades, scripts cortos, ideas de miniaturas, ganchos de apertura y más.

## 🎯 Enfoque: YouTubers y Creadores de Contenido
- Pensado para YouTubers, editores y equipos de contenido.
- Ahorra tiempo en brainstorming, mantiene consistencia y mejora el CTR y el alcance.
- Útil tanto para canales nuevos como para creadores experimentados que buscan escalar producción.

## 📋 Descripción
Aplicación web moderna para crear y organizar prompts de IA de forma rápida, clara y eficiente. Desarrollada con Angular 20, Angular Material y arquitectura standalone.

## ✨ Características clave
- 🔐 Autenticación JWT con refresh automático
- 🧠 Generación y organización de prompts para YouTube (títulos, descripciones, capítulos, ganchos, miniaturas)
- 📚 Historial y favoritos para reutilizar prompts efectivos
- 🏷️ Categorías por tipo de contenido (tutoriales, vlogs, educación, gaming, reviews, shorts)
- 🎨 UI moderna y responsiva con Material Design

## 🛠️ Tecnologías
- Frontend: Angular 20.2.1
- UI: Angular Material
- Lenguaje: TypeScript 5.9.2
- Estado: RxJS (BehaviorSubject)
- Autenticación: JWT con HttpOnly cookies

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

## 🧭 Flujo para YouTubers (recomendado)
1) Elige proveedor de IA y categoría de contenido (p. ej., “Educación” o “Shorts”).
2) Describe tu video en 1–2 líneas.
3) Genera prompts listos para: título, descripción SEO, ganchos, capítulos, idea de miniatura y CTA.
4) Guarda en favoritos los prompts que mejor funcionen y reutilízalos en próximos videos.

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
└── assets/                   # Imágenes, iconos, estilos
```

## 🔐 Autenticación (resumen)
- Endpoints: login, register, refresh, logout, validate
- Estrategia: access token en memoria + refresh token en cookie HttpOnly
- Interceptor con reintento automático ante 401

## 🎨 Componentes principales
- Login: formulario simple y seguro
- Prompt Generator: generación, contador de caracteres, categorías, historial/favoritos

## 🔧 Configuración rápida
```typescript
// environment.ts
export const environment = {
  production: false,
  api: 'http://localhost:8080'
};
```
CORS del backend: permitir origen `http://localhost:4200` con credenciales.

## 📱 Responsive Design
- Mobile First, CSS Grid + Flexbox, breakpoints adaptados

## 🧪 Scripts útiles
```bash
npm run start   # ng serve
npm run build   # ng build
npm run test    # ng test
npm run lint    # ng lint
```

## 📝 Ideas de categorías orientadas a YouTube
- Títulos y ganchos
- Descripciones SEO y hashtags
- Capítulos/temporalidades
- Ideas de miniatura (copy + elementos visuales)
- CTA (suscripción, comentarios, siguiente video)
- Scripts para Shorts

## 👤 Autor
**Alejandro** — Desarrollador Full Stack
- Email: alejandropsn27@gmail.com
- GitHub: [@Biershoot](https://github.com/Biershoot)

---

¡Crea prompts poderosos para tus videos de YouTube con Prompts Genius y acelera tu producción creativa! 🚀🎥
