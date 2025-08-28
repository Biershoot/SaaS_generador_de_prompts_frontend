import { Injectable } from '@angular/core';

export interface JwtPayload {
  sub: string; // Subject (user ID)
  email: string;
  name: string;
  iat: number; // Issued at
  exp: number; // Expiration time
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  /**
   * Guarda el token JWT en localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Obtiene el token JWT del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Guarda el refresh token
   */
  saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Obtiene el refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Elimina todos los tokens
   */
  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Verifica si el token existe y no ha expirado
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      return !!(payload && payload.exp * 1000 > Date.now());
    } catch {
      return false;
    }
  }

  /**
   * Decodifica el token JWT (sin verificar la firma)
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Obtiene el payload del token actual
   */
  getTokenPayload(): JwtPayload | null {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  /**
   * Obtiene el tiempo restante hasta que expire el token (en milisegundos)
   */
  getTokenExpirationTime(): number {
    const payload = this.getTokenPayload();
    if (!payload) return 0;
    return payload.exp * 1000 - Date.now();
  }

  /**
   * Verifica si el token expirará pronto (en los próximos 5 minutos)
   */
  isTokenExpiringSoon(): boolean {
    const expirationTime = this.getTokenExpirationTime();
    return expirationTime > 0 && expirationTime < 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Obtiene el ID del usuario del token
   */
  getUserId(): string | null {
    const payload = this.getTokenPayload();
    return payload?.sub || null;
  }

  /**
   * Obtiene el email del usuario del token
   */
  getUserEmail(): string | null {
    const payload = this.getTokenPayload();
    return payload?.email || null;
  }

  /**
   * Obtiene el nombre del usuario del token
   */
  getUserName(): string | null {
    const payload = this.getTokenPayload();
    return payload?.name || null;
  }
}
