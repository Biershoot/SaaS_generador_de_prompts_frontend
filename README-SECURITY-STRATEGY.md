# 🔐 Estrategia de Seguridad - Refresh Tokens + Access Tokens

## 📋 Resumen

Esta implementación sigue las mejores prácticas de seguridad para aplicaciones web modernas, utilizando una estrategia de **Refresh Tokens** en HttpOnly cookies y **Access Tokens** en memoria.

## 🏗️ Arquitectura de Seguridad

### Estrategia de Almacenamiento
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Access Token  │    │  Refresh Token  │    │   User Data     │
│                 │    │                 │    │                 │
│   📝 Memoria    │    │ 🍪 HttpOnly     │    │ 💾 localStorage │
│   (Angular)     │    │   Cookie        │    │   (Angular)     │
│                 │    │   (Backend)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flujo de Autenticación
```
1. Login → Backend genera Access + Refresh tokens
2. Access Token → Memoria Angular (temporal)
3. Refresh Token → HttpOnly Cookie (persistente)
4. Requests → Access Token en Authorization header
5. 401 Error → Refresh automático con HttpOnly cookie
6. Nuevo Access Token → Memoria Angular
7. Reintentar request original
```

## 🔧 Implementación

### 1. AuthService (Angular)

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: string | null = null;

  // Login con refresh token en HttpOnly cookie
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { 
      withCredentials: true 
    }).pipe(
      tap(res => {
        this.accessToken = res.accessToken; // Guardar en memoria
      })
    );
  }

  // Refresh automático usando HttpOnly cookie
  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}, { 
      withCredentials: true 
    }).pipe(
      tap(res => {
        this.accessToken = res.accessToken;
      })
    );
  }

  // Logout que limpia cookies y memoria
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { 
      withCredentials: true 
    }).pipe(
      tap(() => {
        this.accessToken = null;
        localStorage.removeItem('current_user');
      })
    );
  }
}
```

### 2. Interceptor con Refresh Automático

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            
            return this.authService.refresh().pipe(
              switchMap((res: any) => {
                this.isRefreshing = false;
                this.refreshSubject.next(res.accessToken);
                
                // Reintentar request original
                const newReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` }
                });
                return next.handle(newReq);
              }),
              catchError((refreshErr) => {
                this.isRefreshing = false;
                this.authService.clearAuth();
                this.router.navigate(['/login']);
                return throwError(() => refreshErr);
              })
            );
          } else {
            // Esperar refresh en curso
            return this.refreshSubject.pipe(
              filter(tokenVal => tokenVal !== null),
              take(1),
              switchMap((token) => {
                const newReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${token}` }
                });
                return next.handle(newReq);
              })
            );
          }
        }
        return throwError(() => err);
      })
    );
  }
}
```

### 3. Inicialización Automática

```typescript
@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  init(): Observable<boolean> {
    // Intentar refresh automático al cargar la app
    return this.authService.refresh().pipe(
      tap(() => console.log('✅ Refresh automático exitoso')),
      catchError((err) => {
        console.log('ℹ️ No hay sesión activa');
        return of(false);
      })
    );
  }
}
```

## 🔒 Configuración del Backend (Spring Boot)

### 1. Configuración CORS con Credentials

```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true); // 🔑 Importante para cookies
            }
        };
    }
}
```

### 2. Endpoints de Autenticación

```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, 
                                            HttpServletResponse response) {
        // Validar credenciales
        AuthResponse authResponse = authService.authenticate(request);
        
        // Crear HttpOnly cookie con refresh token
        Cookie refreshCookie = new Cookie("refresh_token", authResponse.getRefreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true); // Solo HTTPS en producción
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 días
        response.addCookie(refreshCookie);
        
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@CookieValue("refresh_token") String refreshToken) {
        // Validar refresh token y generar nuevo access token
        AuthResponse authResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Invalidar refresh token y limpiar cookie
        Cookie refreshCookie = new Cookie("refresh_token", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0); // Eliminar cookie
        response.addCookie(refreshCookie);
        
        return ResponseEntity.ok().build();
    }
}
```

## 🚀 Ventajas de esta Estrategia

### ✅ Seguridad
- **Refresh Token**: HttpOnly cookie (no accesible desde JavaScript)
- **Access Token**: Memoria temporal (se pierde al cerrar navegador)
- **XSS Protection**: Tokens no accesibles desde scripts maliciosos
- **CSRF Protection**: Tokens en headers, no en cookies

### ✅ Experiencia de Usuario
- **Sesión Persistente**: Refresh automático mantiene sesión
- **Transparencia**: Usuario no nota los refreshes automáticos
- **Fallback Graceful**: Redirección automática al login si falla

### ✅ Escalabilidad
- **Access Tokens Cortos**: Menor riesgo si se comprometen
- **Refresh Tokens Largos**: Menos requests de login
- **Concurrencia**: Manejo de múltiples requests simultáneos

## 🧪 Testing

### 1. Verificar Cookies HttpOnly
```bash
# En DevTools → Application → Cookies
# Verificar que refresh_token tiene HttpOnly: true
```

### 2. Verificar Refresh Automático
```bash
# 1. Hacer login
# 2. Esperar que expire access token
# 3. Hacer una petición
# 4. Verificar que se hace refresh automático
```

### 3. Verificar Logout
```bash
# 1. Hacer logout
# 2. Verificar que se elimina la cookie
# 3. Verificar que se limpia la memoria
```

## 🐛 Troubleshooting

### Error: "withCredentials: true"
- Verificar configuración CORS en backend
- Verificar que `allowCredentials: true` esté configurado

### Error: Cookie no se envía
- Verificar dominio y path de la cookie
- Verificar configuración `secure` en producción

### Error: Refresh infinito
- Verificar lógica de refresh en interceptor
- Verificar manejo de errores en refresh

## 📝 Notas de Producción

### Configuración de Cookies
```java
// En producción
cookie.setSecure(true);     // Solo HTTPS
cookie.setDomain(".tudominio.com");  // Subdominios
cookie.setSameSite("Strict");        // Protección CSRF
```

### Configuración de Tokens
```java
// Access Token: 15-30 minutos
// Refresh Token: 7-30 días
// Implementar blacklist para refresh tokens invalidados
```

### Monitoreo
- Logs de refresh automático
- Métricas de tokens expirados
- Alertas de refresh fallidos

¡Esta estrategia proporciona la máxima seguridad con la mejor experiencia de usuario! 🚀
