import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class LoginComponent {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  backendStatus: { type: 'success' | 'error' | 'info', message: string } | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  testBackendConnection() {
    console.log('🔍 Probando conectividad con el backend...');
    this.backendStatus = { type: 'info', message: 'Probando conexión...' };
    
    this.authService.testBackendConnection().subscribe({
      next: () => {
        this.backendStatus = { 
          type: 'success', 
          message: '✅ Backend conectado correctamente' 
        };
        this.snackBar.open('Backend conectado correctamente', 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        console.error('❌ Error de conectividad:', err);
        this.backendStatus = { 
          type: 'error', 
          message: `❌ Error de conexión: ${err.status || 'Desconocido'}` 
        };
        this.snackBar.open('Error de conexión con el backend', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  login() {
    if (!this.email || !this.password) {
      this.snackBar.open('Por favor completa todos los campos', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    this.loading = true;
    console.log('🔐 Intentando login con:', { username: this.email, password: '***' });
    
    this.authService.login({ username: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('✅ Login exitoso:', res);
        this.snackBar.open('¡Bienvenido!', 'OK', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error detallado del login:', err);
        
        // Mostrar información detallada del error
        let errorMessage = 'Error al iniciar sesión';
        
        if (err.status) {
          console.log(`📊 Status HTTP: ${err.status}`);
          errorMessage += ` (Status: ${err.status})`;
        }
        
        if (err.error?.message) {
          console.log(`📝 Mensaje del backend: ${err.error.message}`);
          errorMessage = err.error.message;
        } else if (err.message) {
          console.log(`📝 Mensaje de error: ${err.message}`);
          errorMessage = err.message;
        }
        
        if (err.error?.error) {
          console.log(`🔍 Error interno:`, err.error.error);
        }
        
        // Mostrar mensaje específico según el tipo de error
        if (err.status === 0) {
          errorMessage = 'No se puede conectar con el backend. Verifica que esté ejecutándose.';
        } else if (err.status === 401) {
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (err.status === 500) {
          errorMessage = 'Error interno del servidor. Contacta al administrador.';
        } else if (err.status === 404) {
          errorMessage = 'Endpoint no encontrado. Verifica la configuración del backend.';
        }
        
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 8000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
