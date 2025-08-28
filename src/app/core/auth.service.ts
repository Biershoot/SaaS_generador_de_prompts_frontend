import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

  constructor() {
    this.checkInitialAuthState();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.config.authUrls.login, credentials, {
      withCredentials: true // Importante para cookies
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(err => {
        this.errorHandler.handleError(err, 'Login');
        throw err;
      })
    );
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
}
