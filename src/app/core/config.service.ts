import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly baseUrl = environment.api;

  // URLs de autenticación
  get authUrls() {
    return {
      login: `${this.baseUrl}/auth/login`,
      register: `${this.baseUrl}/auth/register`,
      refresh: `${this.baseUrl}/auth/refresh`,
      logout: `${this.baseUrl}/auth/logout`,
      validate: `${this.baseUrl}/auth/validate`
    };
  }

  // URLs de prompts
  get promptUrls() {
    return {
      generate: `${this.baseUrl}/api/ai/generate`,
      history: `${this.baseUrl}/api/prompts`,
      favorites: `${this.baseUrl}/api/prompts/favorites`
    };
  }

  // URL base para otras APIs
  get apiUrl() {
    return this.baseUrl;
  }

  // Verificar si estamos en producción
  get isProduction() {
    return environment.production;
  }
}
