import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth.service';

const requireAuth = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [requireAuth],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'generator',
    canActivate: [requireAuth],
    loadComponent: () => import('./components/prompt-generator/prompt-generator.component').then(c => c.PromptGeneratorComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
