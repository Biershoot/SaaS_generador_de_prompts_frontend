import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificar si hay un access token válido en memoria
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Si no hay token, redirigir al login
    this.router.navigate(['/login']);
    return false;
  }
}
