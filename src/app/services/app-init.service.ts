import { Injectable } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(private authService: AuthService) {}

  /**
   * Inicializar la aplicación
   * Intenta hacer refresh automático si hay cookie de refresh token
   */
  init(): Observable<boolean> {
    // Intentar validar token al cargar la app
    return this.authService.validateToken().pipe(
      map(() => true), // Token válido
      tap(() => {
        console.log('✅ Token válido, sesión activa');
      }),
      catchError((err) => {
        console.log('ℹ️ Token inválido o expirado, intentando refresh');
        // Intentar refresh automático
        return this.authService.refreshToken().pipe(
          map(() => true),
          tap(() => {
            console.log('✅ Refresh automático exitoso');
          }),
          catchError((refreshErr) => {
            console.log('ℹ️ No hay sesión activa o refresh token expirado');
            return of(false);
          })
        );
      })
    );
  }

  /**
   * Verificar si hay una sesión válida
   */
  hasValidSession(): boolean {
    return this.authService.isAuthenticated();
  }
}
