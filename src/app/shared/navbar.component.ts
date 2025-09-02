import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, User } from '../core/auth.service';
import { PromptService } from '../core/prompt.service';
import { Observable, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    CommonModule, RouterModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatBadgeModule, MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="navbar-content">
        <!-- Logo y título -->
        <div class="brand" routerLink="/">
          <span class="app-title">PromptGenius</span>
        </div>

        <!-- Navegación principal -->
        <nav class="nav-links" *ngIf="isAuthenticated$ | async">
          <a mat-button routerLink="/" routerLinkActive="active"
             [routerLinkActiveOptions]="{exact:true}">
            Generador
          </a>
          <a mat-button routerLink="/history" routerLinkActive="active">
            <span [matBadge]="promptCount$ | async" matBadgeSize="small"
                  matBadgeColor="accent" [matBadgeHidden]="(promptCount$ | async) === 0">
              Historial
            </span>
          </a>
          <a mat-button routerLink="/favorites" routerLinkActive="active">
            <span [matBadge]="favoriteCount$ | async" matBadgeSize="small"
                  matBadgeColor="warn" [matBadgeHidden]="(favoriteCount$ | async) === 0">
              Favoritos
            </span>
          </a>
        </nav>

        <!-- Menú de usuario -->
        <div class="user-menu">
          <ng-container *ngIf="isAuthenticated$ | async; else authButtons">
            <button mat-icon-button [matMenuTriggerFor]="userMenu"
                    matTooltip="Menú de usuario">
              Usuario
            </button>
            <mat-menu #userMenu="matMenu">
              <div class="user-info">
                <span>{{ (currentUser$ | async)?.fullName }}</span>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/profile">
                <span>Perfil</span>
              </button>
              <button mat-menu-item (click)="logout()">
                <span>Cerrar Sesión</span>
              </button>
            </mat-menu>
          </ng-container>

          <ng-template #authButtons>
            <a mat-button routerLink="/login" class="auth-btn">
              Iniciar Sesión
            </a>
            <a mat-raised-button color="accent" routerLink="/register" class="auth-btn">
              Registrarse
            </a>
          </ng-template>
        </div>

        <!-- Botón de menú móvil -->
        <button mat-icon-button class="mobile-menu"
                [matMenuTriggerFor]="mobileMenu"
                *ngIf="isAuthenticated$ | async">
          Menú
        </button>
        <mat-menu #mobileMenu="matMenu" class="mobile-nav">
          <a mat-menu-item routerLink="/" routerLinkActive="active">
            <span>Generador</span>
          </a>
          <a mat-menu-item routerLink="/history" routerLinkActive="active">
            <span [matBadge]="promptCount$ | async" matBadgeSize="small">
              Historial
            </span>
          </a>
          <a mat-menu-item routerLink="/favorites" routerLinkActive="active">
            <span [matBadge]="favoriteCount$ | async" matBadgeSize="small">
              Favoritos
            </span>
          </a>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      transition: opacity 0.2s;
    }

    .brand:hover {
      opacity: 0.8;
    }

    .app-title {
      font-size: 20px;
      font-weight: bold;
      color: white;
      letter-spacing: -0.5px;
    }

    /* Fuerza texto blanco en todos los botones/labels del navbar */
    .navbar :where(.mat-mdc-button, .mat-mdc-icon-button, .mdc-button__label, .mat-mdc-menu-item-text, a, button) {
      color: #fff !important;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      justify-content: center;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      gap: 6px;
      border-radius: 8px;
      transition: background-color 0.2s;
      color: white;
    }

    .nav-links a.active {
      background-color: rgba(255,255,255,0.1);
    }

    .nav-links a:hover {
      background-color: rgba(255,255,255,0.05);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      color: #666;
      font-weight: 500;
    }

    .auth-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      color: white;
    }

    .mobile-menu {
      display: none;
    }

    .mobile-nav {
      min-width: 200px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .mobile-menu {
        display: block;
      }

      .app-title {
        font-size: 18px;
      }

      .auth-btn span {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .navbar-content {
        padding: 0 8px;
      }

      .app-title {
        font-size: 16px;
      }

      .user-menu .auth-btn:first-child {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  promptCount$: Observable<number>;
  favoriteCount$: Observable<number>;

  private authService = inject(AuthService);
  private promptService = inject(PromptService);
  private router = inject(Router);

  constructor() {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
    this.promptCount$ = this.promptService.prompts$.pipe(
      map(prompts => prompts.length)
    );
    this.favoriteCount$ = this.promptService.getFavoritePrompts().pipe(
      map(favorites => favorites.length)
    );
  }

  logout() {
    this.authService.logout();
  }
}
