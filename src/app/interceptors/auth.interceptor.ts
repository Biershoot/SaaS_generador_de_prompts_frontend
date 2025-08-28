import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    private injector: Injector,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let request = req;

    // Agregar token si existe
    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Si ya estamos refrescando, esperar la respuesta
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshSubject.next(null);

            return this.authService.refreshToken().pipe(
              switchMap((res: any) => {
                this.isRefreshing = false;
                this.refreshSubject.next(res.accessToken);
                
                // Reintentar la petición original con nuevo token
                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`
                  }
                });
                return next.handle(newReq);
              }),
              catchError((refreshErr) => {
                this.isRefreshing = false;
                this.refreshSubject.next(null);
                
                                 // Limpiar autenticación y redirigir al login
                 this.authService.clearAuth();
                return throwError(() => refreshErr);
              })
            );
          } else {
            // Si otra petición está refrescando, esperar al nuevo token
            return this.refreshSubject.pipe(
              filter(tokenVal => tokenVal !== null),
              take(1),
              switchMap((token) => {
                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
                });
                return next.handle(newReq);
              })
            );
          }
        }
        return throwError(() => err);
      })
    );
  }
}
