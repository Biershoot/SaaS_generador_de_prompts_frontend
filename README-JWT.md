# 🔐 Configuración JWT para Angular + Spring Boot

## 📋 Resumen de la Implementación

Este proyecto ya tiene implementada una **autenticación JWT completa** con las mejores prácticas de Angular moderno.

## 🏗️ Arquitectura Implementada

### 1. **Servicios Core**
- ✅ `AuthService` - Manejo de login, registro y autenticación
- ✅ `TokenService` - Gestión y validación de tokens JWT
- ✅ `ConfigService` - Configuración centralizada de URLs
- ✅ `ErrorHandlerService` - Manejo centralizado de errores
- ✅ `AuthInterceptor` - Interceptor para adjuntar tokens automáticamente

### 2. **Componentes de Autenticación**
- ✅ `LoginComponent` - Formulario de inicio de sesión
- ✅ `RegisterComponent` - Formulario de registro
- ✅ `NavbarComponent` - Navegación con estado de autenticación

### 3. **Guards de Rutas**
- ✅ `authGuard` - Protege rutas que requieren autenticación
- ✅ `guestGuard` - Protege rutas solo para usuarios no autenticados

## 🔧 Configuración del Backend

### Endpoints Requeridos

Tu backend Spring Boot debe implementar estos endpoints:

```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Validar credenciales y generar JWT
        // Retornar: { token, refreshToken?, user }
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Crear usuario y generar JWT
        // Retornar: { token, refreshToken?, user }
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        // Validar refresh token y generar nuevo JWT
        // Retornar: { token, refreshToken?, user }
    }
}
```

### Estructura de Respuesta JWT

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "usuario@email.com",
    "name": "Nombre Usuario"
  }
}
```

### Payload del JWT

El token JWT debe contener:

```json
{
  "sub": "user_id",
  "email": "usuario@email.com", 
  "name": "Nombre Usuario",
  "iat": 1640995200,
  "exp": 1640998800
}
```

## 🌐 Configuración de URLs

### Desarrollo
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  api: 'http://localhost:8080'  // Tu backend Spring Boot
};
```

### Producción
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  api: 'https://tu-backend-produccion.com'
};
```

## 🚀 Características Implementadas

### ✅ Gestión Automática de Tokens
- Almacenamiento seguro en localStorage
- Validación automática de expiración
- Refresh automático de tokens expirados
- Decodificación del payload JWT

### ✅ Interceptor HTTP
- Adjunta automáticamente el token a todas las requests
- Maneja errores 401 (no autorizado)
- Intenta refresh automático en caso de token expirado
- Redirige al login si el refresh falla

### ✅ Manejo de Errores
- Mensajes de error centralizados
- Snackbars con estilos diferenciados
- Logging automático de errores
- Manejo específico por código de estado HTTP

### ✅ Guards de Rutas
- Protección automática de rutas
- Redirección inteligente según estado de autenticación
- Guards funcionales (moderno Angular)

### ✅ UI/UX
- Formularios reactivos con validación
- Indicadores de carga
- Mensajes de error contextuales
- Diseño responsive con Material Design

## 🔒 Seguridad

### ✅ Mejores Prácticas Implementadas
- Tokens almacenados en localStorage (considerar httpOnly cookies para producción)
- Validación de expiración en cliente y servidor
- Refresh tokens para renovación automática
- Interceptor que maneja errores de autenticación
- Guards que protegen rutas sensibles

### ⚠️ Consideraciones de Seguridad
- **Producción**: Considera usar httpOnly cookies en lugar de localStorage
- **HTTPS**: Obligatorio en producción
- **CORS**: Configura correctamente en tu backend
- **Rate Limiting**: Implementa en tu backend

## 🧪 Testing

### Verificar Funcionamiento

1. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```

2. **Verificar que el backend esté corriendo en:**
   ```
   http://localhost:8080
   ```

3. **Probar el flujo completo:**
   - Registro de usuario
   - Login
   - Acceso a rutas protegidas
   - Logout
   - Refresh automático de tokens

## 📝 Logs y Debugging

### Verificar Tokens
```typescript
// En la consola del navegador
const tokenService = inject(TokenService);
console.log('Token válido:', tokenService.isTokenValid());
console.log('Payload:', tokenService.getTokenPayload());
console.log('Expira en:', tokenService.getTokenExpirationTime());
```

### Verificar Estado de Autenticación
```typescript
// En la consola del navegador
const authService = inject(AuthService);
authService.isAuthenticated$.subscribe(console.log);
authService.currentUser$.subscribe(console.log);
```

## 🎯 Próximos Pasos

1. **Configurar tu backend Spring Boot** con los endpoints requeridos
2. **Ajustar las URLs** en `environment.ts` según tu configuración
3. **Probar el flujo completo** de autenticación
4. **Configurar CORS** en tu backend si es necesario
5. **Implementar medidas de seguridad adicionales** para producción

## 📞 Soporte

Si tienes problemas con la implementación:

1. Verifica que tu backend esté corriendo en el puerto correcto
2. Revisa la consola del navegador para errores
3. Verifica que los endpoints del backend coincidan con la configuración
4. Asegúrate de que el JWT tenga el formato correcto

¡Tu aplicación Angular ya está lista para conectarse con tu backend JWT! 🚀
