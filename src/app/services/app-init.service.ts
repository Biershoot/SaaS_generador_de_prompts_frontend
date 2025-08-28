import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
    // Intentar refresh automático al cargar la app
    return this.authService.refresh().pipe(
      tap(() => {
        console.log('✅ Refresh automático exitoso');
      }),
      catchError((err) => {
        console.log('ℹ️ No hay sesión activa o refresh token expirado');
        return of(false);
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
