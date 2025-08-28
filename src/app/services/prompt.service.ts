import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PromptRequest {
  input: string;
  provider?: string;
  category?: string;
}

export interface PromptResponse {
  prompt: string;
  id?: string;
  createdAt?: string;
  provider?: string;
}

export interface Prompt {
  id: string;
  input: string;
  generatedPrompt: string;
  provider: string;
  category?: string;
  createdAt: string;
  isFavorite?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = `${environment.api}/api/prompts`;

  constructor(private http: HttpClient) {}

  /**
   * Generar un prompt usando la IA
   */
  generatePrompt(data: PromptRequest): Observable<PromptResponse> {
    return this.http.post<PromptResponse>(`${this.apiUrl}/generate`, data);
  }

  /**
   * Obtener todos los prompts del usuario
   */
  getAllPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(this.apiUrl);
  }

  /**
   * Obtener un prompt específico por ID
   */
  getPromptById(id: string): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiUrl}/${id}`);
  }

  /**
   * Guardar un prompt generado
   */
  savePrompt(prompt: Partial<Prompt>): Observable<Prompt> {
    return this.http.post<Prompt>(this.apiUrl, prompt);
  }

  /**
   * Actualizar un prompt existente
   */
  updatePrompt(id: string, prompt: Partial<Prompt>): Observable<Prompt> {
    return this.http.put<Prompt>(`${this.apiUrl}/${id}`, prompt);
  }

  /**
   * Eliminar un prompt
   */
  deletePrompt(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener prompts favoritos
   */
  getFavoritePrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.apiUrl}/favorites`);
  }

  /**
   * Marcar/desmarcar como favorito
   */
  toggleFavorite(id: string): Observable<Prompt> {
    return this.http.patch<Prompt>(`${this.apiUrl}/${id}/favorite`, {});
  }

  /**
   * Obtener prompts por categoría
   */
  getPromptsByCategory(category: string): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Obtener prompts por proveedor de IA
   */
  getPromptsByProvider(provider: string): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.apiUrl}/provider/${provider}`);
  }
}
