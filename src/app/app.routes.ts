import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

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
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'generator',
    loadComponent: () => import('./components/prompt-generator/prompt-generator.component').then(c => c.PromptGeneratorComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
