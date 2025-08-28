import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.api}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Método para hacer login (POST al backend)
   */
  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Guardar el JWT en localStorage
   */
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  /**
   * Obtener el token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Método para cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
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
  saveUser(user: any) {
    localStorage.setItem('current_user', JSON.stringify(user));
  }
}
