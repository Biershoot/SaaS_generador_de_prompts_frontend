# 🔗 Conexión Angular + Spring Boot

## 📋 Resumen

Esta documentación explica cómo conectar tu aplicación Angular con el backend Spring Boot para el generador de prompts de IA.

## 🏗️ Estructura de la Conexión

### Frontend (Angular)
```
src/app/
├── services/
│   ├── auth.service.ts          # Autenticación JWT
│   └── prompt.service.ts        # Servicios de prompts
├── components/
│   └── prompt-generator/
│       ├── prompt-generator.component.ts
│       ├── prompt-generator.component.html
│       └── prompt-generator.component.css
└── pages/
    ├── login/
    └── dashboard/
```

### Backend (Spring Boot)
```
src/main/java/
├── config/
│   └── WebConfig.java           # Configuración CORS
├── controller/
│   ├── AuthController.java      # Endpoints de autenticación
│   └── PromptController.java    # Endpoints de prompts
├── service/
│   ├── AuthService.java
│   └── PromptService.java
└── model/
    ├── User.java
    └── Prompt.java
```

## 🔧 Configuración del Backend

### 1. Configuración CORS

```java
// src/main/java/config/WebConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

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
                        .allowCredentials(true);
            }
        };
    }
}
```

### 2. Endpoints de Autenticación

```java
// src/main/java/controller/AuthController.java
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, null, "Credenciales inválidas"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(null, null, e.getMessage()));
        }
    }
}
```

### 3. Endpoints de Prompts

```java
// src/main/java/controller/PromptController.java
@RestController
@RequestMapping("/api/prompts")
@CrossOrigin(origins = "http://localhost:4200")
public class PromptController {
    
    @Autowired
    private PromptService promptService;
    
    @PostMapping("/generate")
    public ResponseEntity<PromptResponse> generatePrompt(@RequestBody PromptRequest request) {
        try {
            PromptResponse response = promptService.generatePrompt(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new PromptResponse(null, e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Prompt>> getAllPrompts(@RequestHeader("Authorization") String token) {
        try {
            List<Prompt> prompts = promptService.getAllPrompts(token);
            return ResponseEntity.ok(prompts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Prompt> savePrompt(@RequestBody Prompt prompt, 
                                           @RequestHeader("Authorization") String token) {
        try {
            Prompt savedPrompt = promptService.savePrompt(prompt, token);
            return ResponseEntity.ok(savedPrompt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
```

## 🔧 Configuración del Frontend

### 1. Variables de Entorno

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  api: 'http://localhost:8080'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  api: 'https://tu-backend-produccion.com'
};
```

### 2. Servicio de Prompts

```typescript
// src/app/services/prompt.service.ts
@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = `${environment.api}/api/prompts`;

  constructor(private http: HttpClient) {}

  generatePrompt(data: PromptRequest): Observable<PromptResponse> {
    return this.http.post<PromptResponse>(`${this.apiUrl}/generate`, data);
  }

  getAllPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(this.apiUrl);
  }

  savePrompt(prompt: Partial<Prompt>): Observable<Prompt> {
    return this.http.post<Prompt>(this.apiUrl, prompt);
  }
}
```

### 3. Interceptor de Autenticación

```typescript
// src/app/interceptors/auth.interceptor.ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
```

## 🚀 Flujo de Comunicación

### 1. Autenticación
```
Angular → POST /auth/login → Spring Boot
Spring Boot → JWT Token → Angular
Angular → Guarda token en localStorage
```

### 2. Generación de Prompts
```
Angular → POST /api/prompts/generate → Spring Boot
Spring Boot → Procesa con IA → Angular
Angular → Muestra resultado
```

### 3. Guardado de Prompts
```
Angular → POST /api/prompts → Spring Boot
Spring Boot → Guarda en BD → Angular
Angular → Confirma guardado
```

## 📡 Endpoints Completos

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrarse
- `POST /auth/refresh` - Refrescar token
- `POST /auth/logout` - Cerrar sesión

### Prompts
- `POST /api/prompts/generate` - Generar prompt
- `GET /api/prompts` - Obtener todos los prompts
- `POST /api/prompts` - Guardar prompt
- `GET /api/prompts/{id}` - Obtener prompt específico
- `PUT /api/prompts/{id}` - Actualizar prompt
- `DELETE /api/prompts/{id}` - Eliminar prompt
- `GET /api/prompts/favorites` - Obtener favoritos
- `PATCH /api/prompts/{id}/favorite` - Marcar como favorito

## 🔒 Seguridad

### JWT Token
- El token se envía en el header `Authorization: Bearer {token}`
- El interceptor lo adjunta automáticamente
- El backend valida el token en cada request

### CORS
- Configurado para permitir `http://localhost:4200`
- Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS
- Headers permitidos: todos
- Credentials: true

## 🧪 Testing

### 1. Verificar CORS
```bash
# En el navegador, abrir DevTools → Network
# Hacer una petición desde Angular
# Verificar que no hay errores CORS
```

### 2. Verificar Autenticación
```bash
# 1. Hacer login
# 2. Verificar que el token se guarda
# 3. Hacer una petición autenticada
# 4. Verificar que el token se envía
```

### 3. Verificar Generación de Prompts
```bash
# 1. Ir al generador de prompts
# 2. Ingresar texto
# 3. Hacer clic en "Generar"
# 4. Verificar que se recibe respuesta
```

## 🐛 Troubleshooting

### Error CORS
- Verificar que el backend esté corriendo en puerto 8080
- Verificar configuración CORS en Spring Boot
- Verificar que Angular esté en puerto 4200

### Error de Autenticación
- Verificar que el token se esté enviando
- Verificar que el token no haya expirado
- Verificar configuración JWT en Spring Boot

### Error de Conexión
- Verificar que ambos servicios estén corriendo
- Verificar URLs en environment.ts
- Verificar firewall/antivirus

## 📝 Notas Importantes

- **Puertos**: Angular (4200), Spring Boot (8080)
- **CORS**: Configurado para desarrollo local
- **JWT**: Tokens con expiración configurable
- **Error Handling**: Manejo centralizado de errores
- **Loading States**: Indicadores de carga en UI

¡La conexión está lista para usar! 🚀
