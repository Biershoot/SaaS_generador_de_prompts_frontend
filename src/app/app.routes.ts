import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

// Auth Guard
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map(isAuth => isAuth ? true : router.parseUrl('/login'))
  );
};

// Guest Guard (solo para usuarios no autenticados)
export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map(isAuth => !isAuth ? true : router.parseUrl('/'))
  );
};

export const routes: Routes = [
  // Rutas públicas
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },

  // Rutas protegidas
  {
    path: '',
    loadComponent: () => import('./features/prompt/prompt-page.component').then(m => m.PromptPageComponent),
    canActivate: [authGuard]
  },

  // Redirección por defecto
  { path: '**', redirectTo: '/login' }
];
