import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class LoginComponent implements OnInit {
  username: string = ''; // Cambiado de 'email' a 'username' para coincidir con el backend
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  backendStatus: { type: string; message: string } | null = null;
  showTestFeatures: boolean = false; // Para mostrar/ocultar funciones de testing

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya está logueado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials: LoginRequest = {
      username: this.username, // Puede ser email o username
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = `Bienvenido, ${response.fullName}!`;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error en login:', error);
        this.errorMessage = this.getErrorMessage(error.message);
      }
    });
  }

  testBackendConnection(): void {
    this.backendStatus = null;

    // Primero probar con OPTIONS request
    this.authService.testBackendConnection().subscribe({
      next: () => {
        this.backendStatus = {
          type: 'success',
          message: '✅ Backend Spring Boot conectado correctamente (Puerto 8080)'
        };
      },
      error: () => {
        // Si falla OPTIONS, probar health check
        this.authService.checkBackendHealth().subscribe({
          next: (response) => {
            this.backendStatus = {
              type: 'success',
              message: `✅ Backend disponible: ${response.message}`
            };
          },
          error: () => {
            this.backendStatus = {
              type: 'error',
              message: '❌ No se pudo conectar con el backend Spring Boot en http://localhost:8080'
            };
          }
        });
      }
    });
  }

  // Función para testing de diagnóstico
  testLoginDiagnostic(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Ingresa credenciales para ejecutar el test de diagnóstico';
      return;
    }

    const credentials: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.testLogin(credentials).subscribe({
      next: (result) => {
        console.log('🔍 Resultado del test de diagnóstico:', result);

        let message = '📋 Diagnóstico:\n';
        message += `Usuario encontrado por username: ${result.userFoundByUsername}\n`;
        message += `Usuario encontrado por email: ${result.userFoundByEmail}\n`;
        message += `Username en BD: ${result.usernameFromDB}\n`;
        message += `Email en BD: ${result.emailFromDB}\n`;
        message += `Contraseña coincide: ${result.passwordMatch}`;

        alert(message);

        if (result.passwordMatch) {
          this.backendStatus = {
            type: 'success',
            message: '✅ Credenciales válidas - puedes hacer login'
          };
        } else {
          this.backendStatus = {
            type: 'error',
            message: '❌ Credenciales inválidas'
          };
        }
      },
      error: (error) => {
        console.error('Error en test de diagnóstico:', error);
        this.backendStatus = {
          type: 'error',
          message: '❌ Error en el test de diagnóstico'
        };
      }
    });
  }

  toggleTestFeatures(): void {
    this.showTestFeatures = !this.showTestFeatures;
  }

  private getErrorMessage(errorMessage: string): string {
    switch (errorMessage) {
      case 'Credenciales inválidas':
        return 'Usuario o contraseña incorrectos';
      case 'Usuario no encontrado':
        return 'No existe una cuenta con ese email/usuario';
      default:
        return 'Error de conexión. Verifica que el backend esté ejecutándose en http://localhost:8080';
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
