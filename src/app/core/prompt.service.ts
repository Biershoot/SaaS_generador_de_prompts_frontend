import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface PromptEntry {
  id: string;
  provider: string;
  prompt: string;
  result: string;
  category: string;
  isFavorite: boolean;
  createdAt: Date;
}

export interface PromptCategory {
  id: string;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class PromptService {
  private config = inject(ConfigService);

  // Estado centralizado
  private promptsSubject = new BehaviorSubject<PromptEntry[]>([]);
  public prompts$ = this.promptsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<PromptCategory[]>([
    { id: 'chat', name: 'Chat', description: 'Prompts para conversación' },
    { id: 'image', name: 'Imagen', description: 'Prompts para generación de imágenes' },
    { id: 'code', name: 'Código', description: 'Prompts para programación' },
    { id: 'writing', name: 'Escritura', description: 'Prompts para texto creativo' },
    { id: 'analysis', name: 'Análisis', description: 'Prompts para análisis de datos' }
  ]);
  public categories$ = this.categoriesSubject.asObservable();

  private http = inject(HttpClient);

  constructor() {
    this.loadPromptsFromStorage();
  }

  generate(provider: string, prompt: string): Observable<string> {
    return this.http.post<string>(
      `${this.config.promptUrls.generate}?provider=${encodeURIComponent(provider)}`,
      prompt,
      {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
        responseType: 'text' as 'json'
      }
    ).pipe(
      tap(() => {
        // No guardar automáticamente, dejar que el componente decida
      })
    );
  }

  addPrompt(provider: string, prompt: string, result: string, category = 'chat'): void {
    const newPrompt: PromptEntry = {
      id: this.generateId(),
      provider,
      prompt,
      result,
      category,
      isFavorite: false,
      createdAt: new Date()
    };

    const currentPrompts = this.promptsSubject.value;
    const updatedPrompts = [newPrompt, ...currentPrompts];
    this.promptsSubject.next(updatedPrompts);
    this.savePromptsToStorage(updatedPrompts);
  }

  toggleFavorite(promptId: string): void {
    const currentPrompts = this.promptsSubject.value;
    const updatedPrompts = currentPrompts.map(p =>
      p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
    );
    this.promptsSubject.next(updatedPrompts);
    this.savePromptsToStorage(updatedPrompts);
  }

  deletePrompt(promptId: string): void {
    const currentPrompts = this.promptsSubject.value;
    const updatedPrompts = currentPrompts.filter(p => p.id !== promptId);
    this.promptsSubject.next(updatedPrompts);
    this.savePromptsToStorage(updatedPrompts);
  }

  getPromptsByCategory(category: string): Observable<PromptEntry[]> {
    return this.prompts$.pipe(
      map(prompts => prompts.filter(p => p.category === category))
    );
  }

  getFavoritePrompts(): Observable<PromptEntry[]> {
    return this.prompts$.pipe(
      map(prompts => prompts.filter(p => p.isFavorite))
    );
  }

  getRecentPrompts(limit = 10): Observable<PromptEntry[]> {
    return this.prompts$.pipe(
      map(prompts => prompts.slice(0, limit))
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadPromptsFromStorage(): void {
    try {
      const stored = localStorage.getItem('prompt_history');
      if (stored) {
        const prompts = JSON.parse(stored).map((p: Record<string, unknown>) => ({
          ...p,
          createdAt: new Date(p['createdAt'] as string)
        }));
        this.promptsSubject.next(prompts);
      }
    } catch (error) {
      console.error('Error loading prompts from storage:', error);
    }
  }

  private savePromptsToStorage(prompts: PromptEntry[]): void {
    try {
      localStorage.setItem('prompt_history', JSON.stringify(prompts));
    } catch (error) {
      console.error('Error saving prompts to storage:', error);
    }
  }
}
