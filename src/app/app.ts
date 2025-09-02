import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar.component';
import { AppInitService } from './services/app-init.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar *ngIf="showNavbar"></app-navbar>
    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 64px);
      background-color: #fafafa;
    }
  `]
})
export class App implements OnInit {
  currentUrl: string = '';
  get showNavbar(): boolean {
    return this.currentUrl.startsWith('/generator');
  }
  
  constructor(private appInitService: AppInitService, private router: Router) {}

  ngOnInit() {
    // Actualizar URL actual para controlar visibilidad del navbar
    this.currentUrl = this.router.url || '';
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.currentUrl = e.urlAfterRedirects || e.url;
      });

    // Inicializar la aplicación con refresh automático
    this.appInitService.init().subscribe({
      next: (success) => {
        if (success) {
          console.log('🚀 Aplicación inicializada con sesión activa');
        } else {
          console.log('🔐 Aplicación inicializada sin sesión');
        }
      },
      error: (err) => {
        console.error('❌ Error al inicializar la aplicación:', err);
      }
    });
  }
}
