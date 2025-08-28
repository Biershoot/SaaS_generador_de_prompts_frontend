import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { TokenService } from './token.service';
import { ErrorHandlerService } from './error-handler.service';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
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
    return this.http.post<AuthResponse>(this.config.authUrls.login, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(err => {
          this.errorHandler.handleError(err, 'Login');
          throw err;
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.config.authUrls.register, userData)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          this.errorHandler.handleError(error, 'Registro');
          throw error;
        })
      );
  }

  logout(): void {
    this.tokenService.clearTokens();
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return of({} as AuthResponse);
    }

    return this.http.post<AuthResponse>(this.config.authUrls.refresh, { refreshToken })
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(() => {
          this.logout();
          return of({} as AuthResponse);
        })
      );
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.tokenService.saveToken(response.token);
    if (response.refreshToken) {
      this.tokenService.saveRefreshToken(response.refreshToken);
    }
    localStorage.setItem('current_user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  private checkInitialAuthState(): void {
    const token = this.tokenService.getToken();
    const userStr = localStorage.getItem('current_user');

    if (token && this.tokenService.isTokenValid() && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    } else if (token && !this.tokenService.isTokenValid()) {
      // Token expirado, intentar refrescar
      this.refreshToken().subscribe({
        error: () => this.logout()
      });
    }
  }
}
