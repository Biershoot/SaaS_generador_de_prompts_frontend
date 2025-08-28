# 🔐 Implementación de Autenticación y Autorización

## 📋 Resumen

Esta implementación sigue las mejores prácticas para autenticación JWT en Angular, proporcionando tanto una versión **simplificada** (como se solicitó) como una versión **avanzada** (ya implementada).

## 🏗️ Estructura de Archivos

### Versión Simplificada (Nueva)
```
src/app/
├── services/
│   └── auth.service.ts          # Servicio de autenticación básico
├── interceptors/
│   └── auth.interceptor.ts      # Interceptor HTTP clásico
├── guards/
│   └── auth.guard.ts           # Guard de autenticación
├── pages/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.css
│   └── dashboard/
│       ├── dashboard.component.ts
│       ├── dashboard.component.html
│       └── dashboard.component.css
└── app.routes-classic.ts       # Rutas con guards tradicionales
```

### Versión Avanzada (Existente)
```
src/app/
├── core/
│   ├── auth.service.ts         # Servicio avanzado con observables
│   ├── token.service.ts        # Gestión de tokens JWT
│   ├── config.service.ts       # Configuración centralizada
│   ├── error-handler.service.ts # Manejo de errores
│   └── auth.interceptor.ts     # Interceptor funcional moderno
├── features/
│   └── auth/
│       ├── login.component.ts
│       └── register.component.ts
└── app.routes.ts              # Rutas con guards funcionales
```

## 🔧 Configuración

### 1. Servicio de Autenticación

#### Versión Simplificada:
```typescript
// src/app/services/auth.service.ts
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.api}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
```

#### Versión Avanzada:
```typescript
// src/app/core/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Métodos avanzados con refresh automático, manejo de errores, etc.
}
```

### 2. Interceptor HTTP

#### Versión Simplificada:
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

#### Versión Avanzada:
```typescript
// src/app/core/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  
  // Lógica avanzada con refresh automático, validación de tokens, etc.
};
```

### 3. Guard de Autenticación

#### Versión Simplificada:
```typescript
// src/app/guards/auth.guard.ts
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

#### Versión Avanzada:
```typescript
// src/app/app.routes.ts
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map(isAuth => isAuth ? true : router.parseUrl('/login'))
  );
};
```

### 4. Componente de Login

#### Versión Simplificada:
```typescript
// src/app/pages/login/login.component.ts
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        if (res.user) {
          this.authService.saveUser(res.user);
        }
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Invalid credentials')
    });
  }
}
```

## 🚀 Configuración del Backend

### Endpoints Requeridos:

```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Validar credenciales y generar JWT
        // Retornar: { token, user }
    }
}
```

### Estructura de Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "username": "usuario",
    "name": "Nombre Usuario",
    "email": "usuario@email.com"
  }
}
```

## 🔄 Migración entre Versiones

### Para usar la versión simplificada:

1. **Actualizar app.config.ts:**
```typescript
import { appConfig } from './app.config-classic';
```

2. **Actualizar app.routes.ts:**
```typescript
import { routes } from './app.routes-classic';
```

3. **Usar los servicios simplificados:**
```typescript
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
```

### Para usar la versión avanzada:

1. **Usar la configuración actual:**
```typescript
import { appConfig } from './app.config';
import { routes } from './app.routes';
```

2. **Usar los servicios avanzados:**
```typescript
import { AuthService } from './core/auth.service';
```

## 🎯 Ventajas de cada Versión

### Versión Simplificada:
- ✅ Fácil de entender y mantener
- ✅ Menos dependencias
- ✅ Ideal para proyectos pequeños
- ✅ Sigue las convenciones clásicas de Angular

### Versión Avanzada:
- ✅ Gestión automática de refresh tokens
- ✅ Manejo centralizado de errores
- ✅ Observables reactivos
- ✅ Validación automática de tokens
- ✅ Mejor experiencia de usuario
- ✅ Escalable para proyectos grandes

## 🧪 Testing

### Verificar Funcionamiento:

1. **Iniciar el servidor:**
```bash
npm start
```

2. **Navegar a:** `http://localhost:4200/login`

3. **Probar el flujo:**
   - Login con credenciales válidas
   - Redirección al dashboard
   - Protección de rutas
   - Logout

## 📝 Notas Importantes

- **Seguridad:** La versión simplificada es funcional pero la avanzada ofrece mejor seguridad
- **Escalabilidad:** Para proyectos grandes, usar la versión avanzada
- **Mantenimiento:** Ambas versiones son mantenibles, elegir según necesidades del proyecto
- **Compatibilidad:** La versión simplificada es compatible con Angular clásico y moderno

¡Ambas implementaciones están listas para usar! 🚀
