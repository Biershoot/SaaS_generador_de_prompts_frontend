import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Ruta de login
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  
  // Ruta del dashboard (protegida)
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  
  // Ruta del generador de prompts (protegida)
  {
    path: 'generator',
    loadComponent: () => import('./components/prompt-generator/prompt-generator.component').then(m => m.PromptGeneratorComponent),
    canActivate: [AuthGuard]
  },
  
  // Ruta principal (protegida)
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  
  // Redirección por defecto
  { path: '**', redirectTo: '/login' }
];
