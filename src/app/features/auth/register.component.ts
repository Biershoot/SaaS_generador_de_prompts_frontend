import { Component, OnInit } from '@angular/core';
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
import { AuthService } from '../../core/auth.service';

// Validador personalizado para confirmar contraseña
function passwordMatchValidator(control: AbstractControl): Record<string, any> | null {
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
            <mat-icon>person_add</mat-icon>
            Crear Cuenta
          </mat-card-title>
          <mat-card-subtitle>
            Únete y comienza a generar prompts increíbles
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre completo</mat-label>
              <input matInput type="text" formControlName="name"
                     placeholder="Tu nombre completo" required>
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                El nombre es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('name')?.hasError('minlength')">
                Mínimo 2 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo electrónico</mat-label>
              <input matInput type="email" formControlName="email"
                     placeholder="tu@email.com" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                El correo es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Ingresa un correo válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'"
                     formControlName="password" placeholder="Mínimo 6 caracteres" required>
              <button matSuffix mat-icon-button type="button"
                      (click)="hidePassword = !hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Mínimo 6 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar contraseña</mat-label>
              <input matInput [type]="hideConfirmPassword ? 'password' : 'text'"
                     formControlName="confirmPassword" placeholder="Repite tu contraseña" required>
              <button matSuffix mat-icon-button type="button"
                      (click)="hideConfirmPassword = !hideConfirmPassword">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Confirma tu contraseña
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch') && !registerForm.get('confirmPassword')?.hasError('required')">
                Las contraseñas no coinciden
              </mat-error>
            </mat-form-field>

            <div class="auth-actions">
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="loading || registerForm.invalid" class="auth-button">
                <mat-icon *ngIf="!loading">person_add</mat-icon>
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <div class="auth-footer">
            <p>¿Ya tienes una cuenta?</p>
            <a mat-button color="primary" routerLink="/login">
              <mat-icon>login</mat-icon>
              Iniciar Sesión
            </a>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      max-width: 400px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .auth-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.5rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .auth-actions {
      margin-top: 16px;
      margin-bottom: 16px;
    }

    .auth-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
    }

    .auth-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .auth-footer p {
      margin: 0;
      color: #666;
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 16px;
      }

      .auth-card {
        max-width: none;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });

    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { name, email, password } = this.registerForm.value;
    const userData = { name, email, password };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.snack.open('¡Cuenta creada exitosamente! Bienvenido.', 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Register error:', error);
        const errorMessage = error.error?.message || 'Error al crear la cuenta. Intenta nuevamente.';
        this.snack.open(errorMessage, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
