import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar.component';
import { AppInitService } from './services/app-init.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
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
  
  constructor(private appInitService: AppInitService) {}

  ngOnInit() {
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
