import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string; // Puede ser email o username según el backend
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  username: string;
  fullName: string;
  role: string;
}

export interface User {
  username: string;
  email: string;
  fullName: string;
  name: string;
  role: string;
}

export interface LogoutResponse {
  message: string;
}

export interface TestLoginResponse {
  userFoundByUsername: boolean;
  userFoundByEmail: boolean;
  usernameFromDB: string;
  emailFromDB: string;
  inputUsername: string;
  inputPassword: string;
  encodedPassword: string;
  passwordMatch: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar si hay un token guardado al inicializar el servicio
    const token = this.getToken();
    if (token) {
      this.validateTokenWithBackend();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials, {
      withCredentials: true, // Importante para las cookies del refresh token
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError(error => {
        console.error('Login error:', error);
        const errorMessage = error.error?.error || 'Error al iniciar sesión';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError(error => {
        console.error('Register error:', error);
        const errorMessage = error.error?.error || 'Error en el registro';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.API_URL}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearSession();
      }),
      catchError(error => {
        // Limpiar sesión local aunque falle el backend
        this.clearSession();
        console.error('Logout error:', error);
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/refresh`, {}, {
      withCredentials: true // Las cookies se envían automáticamente
    }).pipe(
      tap(response => {
        // Actualizar solo el access token, mantener otros datos
        localStorage.setItem('accessToken', response.accessToken);
        if (response.username) {
          localStorage.setItem('username', response.username);
        }
        if (response.fullName) {
          localStorage.setItem('fullName', response.fullName);
        }
      }),
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  validateToken(): Observable<AuthResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token para validar'));
    }

    return this.http.get<AuthResponse>(`${this.API_URL}/auth/validate`, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      tap(response => {
        // Actualizar información del usuario
        const user: User = {
          username: response.username,
          email: response.username,
          fullName: response.fullName,
          name: response.fullName,
          role: response.role
        };
        localStorage.setItem('username', response.username);
        localStorage.setItem('fullName', response.fullName);
        localStorage.setItem('role', response.role);
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  // Método de diagnóstico para testing
  testLogin(credentials: LoginRequest): Observable<TestLoginResponse> {
    return this.http.post<TestLoginResponse>(`${this.API_URL}/auth/test-login`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(error => {
        console.error('Test login error:', error);
        return throwError(() => error);
      })
    );
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUserInfo(): User | null {
    const username = localStorage.getItem('username');
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');

    if (username && fullName && role) {
      return {
        username,
        email: username,
        fullName,
        name: fullName,
        role
      };
    }
    return null;
  }

  // Validar token con el backend al inicializar
  private validateTokenWithBackend(): void {
    this.validateToken().subscribe({
      next: () => {
        // Token válido, usuario ya actualizado en validateToken()
      },
      error: () => {
        // Token inválido, sesión ya limpiada en validateToken()
      }
    });
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('username', authResponse.username);
    localStorage.setItem('fullName', authResponse.fullName);
    localStorage.setItem('role', authResponse.role);

    const user: User = {
      username: authResponse.username,
      email: authResponse.username, // Asumir que username es el email
      fullName: authResponse.fullName,
      name: authResponse.fullName, // Usar fullName como name
      role: authResponse.role
    };
    this.currentUserSubject.next(user);
  }

  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
  }

  // Método para verificar el estado del backend
  checkBackendHealth(): Observable<{status: string, message: string}> {
    // Usando el endpoint de login como health check básico
    return this.http.get<{status: string, message: string}>(`${this.API_URL}/actuator/health`).pipe(
      catchError(() => {
        // Si no existe actuator/health, devolver respuesta manual
        return throwError(() => new Error('Backend no disponible'));
      })
    );
  }

  // Método alternativo para probar conectividad
  testBackendConnection(): Observable<{available: boolean, message: string}> {
    return this.http.options(`${this.API_URL}/auth/login`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(() => ({
        available: true,
        message: 'Backend connection successful'
      })),
      tap(() => {
        console.log('Backend connection test successful');
      }),
      catchError(error => {
        console.error('Backend connection test failed:', error);
        return throwError(() => ({
          available: false,
          message: 'Backend connection failed'
        }));
      })
    );
  }
}
