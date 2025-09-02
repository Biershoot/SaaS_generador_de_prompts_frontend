import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { TokenService } from './token.service';
import { ErrorHandlerService } from './error-handler.service';

export interface User {
  username: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  username: string; // El backend usa email como username
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  username: string;
  fullName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(ConfigService);
  private tokenService = inject(TokenService);
  private errorHandler = inject(ErrorHandlerService);

  // Mock data para desarrollo
  private mockUsers = [
    { username: 'admin@test.com', password: 'admin123', fullName: 'Administrador', role: 'admin' },
    { username: 'user@test.com', password: 'user123', fullName: 'Usuario Demo', role: 'user' },
    { username: 'test@test.com', password: 'test123', fullName: 'Usuario Test', role: 'user' }
  ];

  constructor() {
    this.checkInitialAuthState();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🔐 AuthService: Intentando login con backend real en:', this.config.authUrls.login);
    
    // Primero intentar con el backend real
    return this.http.post<AuthResponse>(this.config.authUrls.login, credentials, {
      withCredentials: true // Importante para cookies
    }).pipe(
      tap(response => {
        console.log('✅ AuthService: Login exitoso con backend real:', response);
        this.handleAuthResponse(response);
      }),
      catchError(err => {
        console.error('❌ AuthService: Error del backend:', err);
        console.log('🔄 AuthService: Activando fallback mock...');
        
        // Si falla, usar mock authentication
        return this.mockLogin(credentials);
      })
    );
  }

  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    const user = this.mockUsers.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const mockResponse: AuthResponse = {
        accessToken: 'mock-jwt-token-' + Date.now(),
        username: user.username,
        fullName: user.fullName,
        role: user.role
      };

      return of(mockResponse).pipe(
        delay(1000), // Simular delay de red
        tap(response => {
          this.handleAuthResponse(response);
          console.log('Login mock exitoso:', response);
        })
      );
    } else {
      return throwError(() => new Error('Credenciales inválidas'));
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.config.authUrls.register, userData, {
      withCredentials: true // Importante para cookies
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        this.errorHandler.handleError(error, 'Registro');
        throw error;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.config.authUrls.logout, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearAuth();
      }),
      catchError(() => {
        // Aún así limpiar localmente si falla la llamada al backend
        this.clearAuth();
        return of({});
      })
    );
  }

  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.config.authUrls.refresh, {}, {
      withCredentials: true // El refresh token está en la cookie
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(() => {
        this.clearAuth();
        return of({} as AuthResponse);
      })
    );
  }

  private handleAuthResponse(response: AuthResponse): void {
    // Guardar access token en localStorage
    localStorage.setItem('accessToken', response.accessToken);
    
    // Crear objeto user y guardarlo
    const user: User = {
      username: response.username,
      fullName: response.fullName,
      role: response.role
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private checkInitialAuthState(): void {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('currentUser');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        // Intentar validar el token con el backend
        this.validateToken().subscribe({
          error: () => {
            // Token inválido, intentar refresh
            this.refreshToken().subscribe({
              error: () => this.clearAuth()
            });
          }
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.clearAuth();
      }
    }
  }

  validateToken(): Observable<any> {
    return this.http.get(`${this.config.authUrls.validate}`, {
      withCredentials: true
    });
  }

  // Método para obtener usuarios mock (para desarrollo)
  getMockUsers() {
    return this.mockUsers.map(u => ({ username: u.username, fullName: u.fullName, role: u.role }));
  }

  // Método para probar conectividad con el backend
  testBackendConnection(): Observable<any> {
    console.log('🔍 AuthService: Probando conectividad con backend...');
    return this.http.get(`${this.config.authUrls.validate}`, {
      withCredentials: true
    }).pipe(
      tap(() => console.log('✅ AuthService: Backend responde correctamente')),
      catchError(err => {
        console.error('❌ AuthService: Backend no responde:', err);
        throw err;
      })
    );
  }

  // Método para verificar si el backend está disponible
  isBackendAvailable(): Observable<boolean> {
    return this.testBackendConnection().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
