import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private snackBar = inject(MatSnackBar);

  /**
   * Maneja errores HTTP y muestra mensajes apropiados al usuario
   */
  handleError(error: HttpErrorResponse, context = 'Operación'): void {
    let message = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      message = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          message = error.error?.message || 'Datos inválidos';
          break;
        case 401:
          message = 'No autorizado. Por favor, inicia sesión nuevamente';
          break;
        case 403:
          message = 'Acceso denegado';
          break;
        case 404:
          message = 'Recurso no encontrado';
          break;
        case 409:
          message = error.error?.message || 'Conflicto con el recurso';
          break;
        case 422:
          message = error.error?.message || 'Datos de validación incorrectos';
          break;
        case 500:
          message = 'Error interno del servidor';
          break;
        case 503:
          message = 'Servicio temporalmente no disponible';
          break;
        default:
          message = `Error ${error.status}: ${error.error?.message || 'Error desconocido'}`;
      }
    }

    this.showError(message);
    console.error(`${context} error:`, error);
  }

  /**
   * Muestra un mensaje de error usando snackbar
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Muestra un mensaje de éxito
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Muestra un mensaje de información
   */
  showInfo(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['info-snackbar']
    });
  }
}
