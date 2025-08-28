import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.api}/auth`;
  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Login con refresh token en HttpOnly cookie
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { 
      withCredentials: true 
    }).pipe(
      tap(res => {
        this.accessToken = res.accessToken;
        if (res.user) {
          this.saveUser(res.user);
        }
      })
    );
  }

  /**
   * Establecer access token en memoria
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Obtener access token de memoria
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Logout que limpia cookies y memoria
   */
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

  /**
   * Refresh token automático usando HttpOnly cookie
   */
  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}, { 
      withCredentials: true 
    }).pipe(
      tap(res => {
        this.accessToken = res.accessToken;
      })
    );
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Obtener usuario autenticado
   */
  getCurrentUser(): any {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Guardar información del usuario
   */
  saveUser(user: any): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Limpiar datos de autenticación
   */
  clearAuth(): void {
    this.accessToken = null;
    localStorage.removeItem('current_user');
  }
}
