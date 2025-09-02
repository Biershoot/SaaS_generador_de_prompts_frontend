import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, RegisterRequest } from '../../services/auth.service';

// Validador personalizado para confirmar contraseña
function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
}

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title class="auth-title">
            Crear Cuenta
          </mat-card-title>
          <mat-card-subtitle>
            Únete y comienza a generar prompts increíbles
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Mensajes de error y éxito -->
          <div *ngIf="errorMessage" class="error-message">
            <mat-icon>error</mat-icon>
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="success-message">
            <mat-icon>check_circle</mat-icon>
            {{ successMessage }}
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
            <!-- Campo de Nombre Completo -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre Completo</mat-label>
              <input matInput type="text" formControlName="fullName"
                     placeholder="Tu nombre completo" required>
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">
                El nombre es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('fullName')?.hasError('minlength')">
                El nombre debe tener al menos 2 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Campo de Email -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo Electrónico</mat-label>
              <input matInput type="email" formControlName="email"
                     placeholder="ejemplo@correo.com" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Ingresa un email válido
              </mat-error>
            </mat-form-field>

            <!-- Campo de Contraseña -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password"
                     placeholder="••••••••" required>
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Campo de Confirmar Contraseña -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar Contraseña</mat-label>
              <input matInput type="password" formControlName="confirmPassword"
                     placeholder="••••••••" required>
              <mat-icon matSuffix>lock_outline</mat-icon>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Confirma tu contraseña
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch') && !registerForm.get('confirmPassword')?.hasError('required')">
                Las contraseñas no coinciden
              </mat-error>
            </mat-form-field>

            <!-- Botón de Registro -->
            <div class="auth-actions">
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="registerForm.invalid || loading"
                      class="register-button">
                <mat-icon *ngIf="loading" class="loading-icon">autorenew</mat-icon>
                <span *ngIf="!loading">Crear Cuenta</span>
                <span *ngIf="loading">Creando cuenta...</span>
              </button>
            </div>
          </form>

          <!-- Enlaces adicionales -->
          <div class="additional-links">
            <p class="login-link">
              ¿Ya tienes una cuenta?
              <a routerLink="/login" class="link">Inicia sesión aquí</a>
            </p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 450px;
      margin: 0 auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border-radius: 16px;
    }

    .auth-title {
      text-align: center;
      color: #333;
      font-size: 28px;
      margin-bottom: 8px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .auth-actions {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }

    .register-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
    }

    .loading-icon {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .additional-links {
      text-align: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .login-link {
      margin: 8px 0;
      color: #666;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      text-decoration: underline;
    }

    .error-message {
      display: flex;
      align-items: center;
      color: #f44336;
      background: #ffebee;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .error-message mat-icon {
      margin-right: 8px;
    }

    .success-message {
      display: flex;
      align-items: center;
      color: #4caf50;
      background: #e8f5e8;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .success-message mat-icon {
      margin-right: 8px;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    // Si ya está logueado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.registerForm.value;
    const registerData: RegisterRequest = {
      email: formValue.email,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      fullName: formValue.fullName
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = `¡Bienvenido, ${response.fullName}! Tu cuenta ha sido creada exitosamente.`;

        this.snackBar.open('Cuenta creada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Redirigir al generador de prompts después de crear la cuenta
        this.router.navigate(['/generator']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error en registro:', error);
        this.errorMessage = this.getErrorMessage(error.message);

        this.snackBar.open(this.errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private getErrorMessage(errorMessage: string): string {
    switch (errorMessage) {
      case 'El correo electrónico ya está registrado':
        return 'Ya existe una cuenta con ese email. Intenta iniciar sesión.';
      case 'Las contraseñas no coinciden':
        return 'Las contraseñas ingresadas no coinciden.';
      default:
        return 'Error al crear la cuenta. Verifica que el backend esté ejecutándose.';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(field => {
      const control = this.registerForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
