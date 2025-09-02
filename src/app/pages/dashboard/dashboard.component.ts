import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <mat-card class="welcome-card">
        <mat-card-header>
          <mat-card-title>¡Bienvenido al Dashboard!</mat-card-title>
          <mat-card-subtitle>Login exitoso</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Has iniciado sesión correctamente. Aquí puedes acceder a todas las funcionalidades de la aplicación.</p>
          <div *ngIf="currentUser" class="user-info">
            <h3>Información del usuario:</h3>
            <p><strong>Email:</strong> {{ currentUser.email }}</p>
            <p><strong>Nombre:</strong> {{ currentUser.name }}</p>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="warn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            Cerrar Sesión
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .welcome-card {
      max-width: 500px;
      width: 100%;
    }
    .user-info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser = this.authService.getCurrentUser();

  ngOnInit(): void {
    // Si no está logueado, redirigir al login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
