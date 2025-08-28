import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  // Añadir token a las requests si existe y es válido
  if (token && tokenService.isTokenValid() && !req.url.includes('/auth/')) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(authReq).pipe(
      catchError(error => {
        // Si el token expiró (401), intentar refrescar
        if (error.status === 401 && !req.url.includes('/auth/refresh')) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Reintentar la request con el nuevo token
              const newToken = authService.getToken();
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(retryReq);
            }),
            catchError(() => {
              authService.logout();
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
