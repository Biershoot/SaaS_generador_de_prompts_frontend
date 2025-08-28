import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PromptService, PromptEntry, PromptCategory } from '../../core/prompt.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-prompt-page',
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatCardModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatIconModule, MatChipsModule,
    MatTabsModule, MatListModule, MatDividerModule,
    MatTooltipModule, MatBadgeModule
  ],
  template: `
  <div class="container">
    <!-- Generador de Prompts -->
    <mat-card class="generator-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>auto_fix_high</mat-icon>
          Generador de Prompts IA
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="provider-field">
              <mat-label>Proveedor de IA</mat-label>
              <mat-select formControlName="provider" required>
                <mat-option value="openai">
                  <mat-icon>psychology</mat-icon>
                  OpenAI (GPT)
                </mat-option>
                <mat-option value="claude">
                  <mat-icon>smart_toy</mat-icon>
                  Anthropic Claude
                </mat-option>
              </mat-select>
              <mat-hint>Selecciona el proveedor de IA</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="category-field">
              <mat-label>Categoría</mat-label>
              <mat-select formControlName="category" required>
                <mat-option *ngFor="let category of categories$ | async" [value]="category.id">
                  {{ category.name }}
                </mat-option>
              </mat-select>
              <mat-hint>Tipo de prompt</mat-hint>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Escribe tu prompt</mat-label>
            <textarea matInput rows="4" formControlName="prompt"
                      placeholder="Describe detalladamente lo que quieres generar..."
                      [class.error]="form.get('prompt')?.invalid && form.get('prompt')?.touched"></textarea>
            <mat-hint align="start">Mínimo 5 caracteres</mat-hint>
            <mat-hint align="end">{{form.get('prompt')?.value?.length || 0}}/500</mat-hint>
            <mat-error *ngIf="form.get('prompt')?.hasError('required')">
              El prompt es requerido
            </mat-error>
            <mat-error *ngIf="form.get('prompt')?.hasError('minlength')">
              El prompt debe tener al menos 5 caracteres
            </mat-error>
          </mat-form-field>

          <div class="actions">
            <button mat-raised-button color="primary" type="submit"
                    [disabled]="loading || form.invalid"
                    class="generate-btn">
              <mat-icon *ngIf="!loading">send</mat-icon>
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              {{ loading ? 'Generando...' : 'Generar Prompt' }}
            </button>

            <button mat-button type="button" (click)="clearForm()"
                    [disabled]="loading" color="warn">
              <mat-icon>clear</mat-icon>
              Limpiar
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>

    <!-- Resultado -->
    <mat-card *ngIf="result" class="result-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon color="primary">lightbulb</mat-icon>
          Resultado Generado
        </mat-card-title>
        <div class="result-actions">
          <button mat-icon-button (click)="copyResult()"
                  matTooltip="Copiar resultado">
            <mat-icon>content_copy</mat-icon>
          </button>
          <button mat-icon-button (click)="saveCurrentPrompt()"
                  matTooltip="Guardar en historial" color="primary">
            <mat-icon>bookmark_add</mat-icon>
          </button>
        </div>
      </mat-card-header>

      <mat-card-content>
        <div class="result-content">{{ result }}</div>
      </mat-card-content>
    </mat-card>

    <!-- Pestañas de Historial y Favoritos -->
    <mat-card class="history-card">
      <mat-tab-group>
        <!-- Historial Reciente -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>history</mat-icon>
            Historial
            <span *ngIf="(recentPrompts$ | async)?.length"
                  matBadge="{{(recentPrompts$ | async)?.length}}"
                  matBadgeSize="small">
            </span>
          </ng-template>

          <div class="tab-content">
            <div *ngIf="(recentPrompts$ | async)?.length === 0" class="empty-state">
              <mat-icon>history</mat-icon>
              <p>No hay prompts en el historial</p>
              <small>Los prompts generados aparecerán aquí</small>
            </div>

            <mat-list *ngIf="(recentPrompts$ | async)?.length">
              <mat-list-item *ngFor="let prompt of recentPrompts$ | async; trackBy: trackByPromptId">
                <div matListItemLine class="prompt-item">
                  <div class="prompt-header">
                    <mat-chip-set>
                      <mat-chip [color]="getCategoryColor(prompt.category)">
                        {{getCategoryName(prompt.category)}}
                      </mat-chip>
                      <mat-chip outlined>{{prompt.provider.toUpperCase()}}</mat-chip>
                    </mat-chip-set>
                    <div class="prompt-actions">
                      <button mat-icon-button (click)="toggleFavorite(prompt)"
                              [color]="prompt.isFavorite ? 'warn' : 'default'"
                              matTooltip="{{prompt.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}}">
                        <mat-icon>{{prompt.isFavorite ? 'favorite' : 'favorite_border'}}</mat-icon>
                      </button>
                      <button mat-icon-button (click)="copyPromptResult(prompt.result)"
                              matTooltip="Copiar resultado">
                        <mat-icon>content_copy</mat-icon>
                      </button>
                      <button mat-icon-button (click)="reusePrompt(prompt)"
                              matTooltip="Reutilizar prompt" color="primary">
                        <mat-icon>refresh</mat-icon>
                      </button>
                      <button mat-icon-button (click)="deletePrompt(prompt.id)"
                              matTooltip="Eliminar" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>
                  <p class="prompt-text">{{prompt.prompt}}</p>
                  <small class="prompt-date">{{formatDate(prompt.createdAt)}}</small>
                </div>
                <mat-divider></mat-divider>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-tab>

        <!-- Favoritos -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>favorite</mat-icon>
            Favoritos
            <span *ngIf="(favoritePrompts$ | async)?.length"
                  matBadge="{{(favoritePrompts$ | async)?.length}}"
                  matBadgeSize="small">
            </span>
          </ng-template>

          <div class="tab-content">
            <div *ngIf="(favoritePrompts$ | async)?.length === 0" class="empty-state">
              <mat-icon>favorite_border</mat-icon>
              <p>No hay prompts favoritos</p>
              <small>Marca prompts como favoritos para acceso rápido</small>
            </div>

            <mat-list *ngIf="(favoritePrompts$ | async)?.length">
              <mat-list-item *ngFor="let prompt of favoritePrompts$ | async; trackBy: trackByPromptId">
                <div matListItemLine class="prompt-item">
                  <div class="prompt-header">
                    <mat-chip-set>
                      <mat-chip [color]="getCategoryColor(prompt.category)">
                        {{getCategoryName(prompt.category)}}
                      </mat-chip>
                      <mat-chip outlined>{{prompt.provider.toUpperCase()}}</mat-chip>
                    </mat-chip-set>
                    <div class="prompt-actions">
                      <button mat-icon-button (click)="toggleFavorite(prompt)"
                              color="warn" matTooltip="Quitar de favoritos">
                        <mat-icon>favorite</mat-icon>
                      </button>
                      <button mat-icon-button (click)="copyPromptResult(prompt.result)"
                              matTooltip="Copiar resultado">
                        <mat-icon>content_copy</mat-icon>
                      </button>
                      <button mat-icon-button (click)="reusePrompt(prompt)"
                              matTooltip="Reutilizar prompt" color="primary">
                        <mat-icon>refresh</mat-icon>
                      </button>
                    </div>
                  </div>
                  <p class="prompt-text">{{prompt.prompt}}</p>
                  <small class="prompt-date">{{formatDate(prompt.createdAt)}}</small>
                </div>
                <mat-divider></mat-divider>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-tab>

        <!-- Por Categorías -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>category</mat-icon>
            Categorías
          </ng-template>

          <div class="tab-content">
            <div class="categories-grid">
              <mat-card *ngFor="let category of categories$ | async"
                        class="category-card"
                        (click)="filterByCategory(category.id)">
                <mat-card-content>
                  <div class="category-info">
                    <h3>{{category.name}}</h3>
                    <p>{{category.description}}</p>
                    <mat-chip [matBadge]="getCategoryCount(category.id)"
                              matBadgeOverlap="false">
                      {{getCategoryCount(category.id)}} prompts
                    </mat-chip>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-card>

    <!-- Loading Overlay -->
    <div class="loading-overlay" *ngIf="loading">
      <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
      <p>Generando tu prompt...</p>
    </div>
  </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 16px;
    }

    .generator-card {
      margin-bottom: 24px;
    }

    .generator-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .provider-field, .category-field {
      flex: 1;
    }

    .full {
      width: 100%;
      margin-bottom: 16px;
    }

    .actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .generate-btn {
      min-width: 160px;
    }

    .result-card {
      margin-bottom: 24px;
      border-left: 4px solid #2196f3;
    }

    .result-card mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .result-actions {
      display: flex;
      gap: 8px;
    }

    .result-content {
      white-space: pre-wrap;
      word-break: break-word;
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      font-family: 'Roboto Mono', monospace;
      line-height: 1.6;
    }

    .history-card {
      margin-bottom: 24px;
    }

    .tab-content {
      padding: 16px 0;
      min-height: 200px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .prompt-item {
      width: 100%;
      padding: 12px 0;
    }

    .prompt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .prompt-actions {
      display: flex;
      gap: 4px;
    }

    .prompt-text {
      margin: 8px 0;
      color: #333;
      line-height: 1.4;
    }

    .prompt-date {
      color: #666;
      font-size: 12px;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px 0;
    }

    .category-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .category-info h3 {
      margin: 0 0 8px 0;
      color: #1976d2;
    }

    .category-info p {
      margin: 0 0 12px 0;
      color: #666;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.9);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .loading-overlay p {
      margin-top: 16px;
      font-size: 16px;
      color: #666;
    }

    .error {
      border-color: #f44336 !important;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .actions {
        flex-direction: column;
        align-items: stretch;
      }

      .generate-btn {
        width: 100%;
      }

      .categories-grid {
        grid-template-columns: 1fr;
      }

      .prompt-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .result-card mat-card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class PromptPageComponent implements OnInit {
  loading = false;
  result = '';
  form!: FormGroup;

  // Observables del servicio
  categories$: Observable<PromptCategory[]>;
  recentPrompts$: Observable<PromptEntry[]>;
  favoritePrompts$: Observable<PromptEntry[]>;
  allPrompts$: Observable<PromptEntry[]>;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private snack: MatSnackBar,
    private clipboard: Clipboard
  ) {
    this.categories$ = this.promptService.categories$;
    this.recentPrompts$ = this.promptService.getRecentPrompts(10);
    this.favoritePrompts$ = this.promptService.getFavoritePrompts();
    this.allPrompts$ = this.promptService.prompts$;
  }

  ngOnInit() {
    this.form = this.fb.group({
      provider: ['openai', Validators.required],
      category: ['chat', Validators.required],
      prompt: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { provider, prompt, category } = this.form.value;
    this.loading = true;
    this.result = '';

    this.promptService.generate(provider, prompt).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        this.snack.open('✅ Prompt generado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        console.error(err);
        this.snack.open('❌ Error generando el prompt. Intenta nuevamente.', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
      }
    });
  }

  clearForm() {
    this.form.reset({
      provider: 'openai',
      category: 'chat',
      prompt: ''
    });
    this.result = '';
  }

  copyResult() {
    if (!this.result) return;
    this.clipboard.copy(this.result);
    this.snack.open('📋 Resultado copiado al portapapeles', 'OK', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  saveCurrentPrompt() {
    if (!this.result) return;
    const { provider, prompt, category } = this.form.value;
    this.promptService.addPrompt(provider, prompt, this.result, category);
    this.snack.open('💾 Prompt guardado en el historial', 'Ver Historial', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  toggleFavorite(prompt: PromptEntry) {
    this.promptService.toggleFavorite(prompt.id);
    const action = prompt.isFavorite ? 'quitado de' : 'agregado a';
    this.snack.open(`⭐ Prompt ${action} favoritos`, 'OK', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  copyPromptResult(result: string) {
    this.clipboard.copy(result);
    this.snack.open('📋 Resultado copiado', 'OK', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  reusePrompt(prompt: PromptEntry) {
    this.form.patchValue({
      provider: prompt.provider,
      category: prompt.category,
      prompt: prompt.prompt
    });
    this.snack.open('🔄 Prompt cargado en el formulario', 'OK', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
    // Scroll al formulario
    document.querySelector('.generator-card')?.scrollIntoView({ behavior: 'smooth' });
  }

  deletePrompt(promptId: string) {
    this.promptService.deletePrompt(promptId);
    this.snack.open('🗑️ Prompt eliminado', 'OK', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  filterByCategory(categoryId: string) {
    // Implementar filtrado por categoría
    console.log('Filtering by category:', categoryId);
  }

  trackByPromptId(index: number, prompt: PromptEntry): string {
    return prompt.id;
  }

  getCategoryName(categoryId: string): string {
    const categories = [
      { id: 'chat', name: 'Chat' },
      { id: 'image', name: 'Imagen' },
      { id: 'code', name: 'Código' },
      { id: 'writing', name: 'Escritura' },
      { id: 'analysis', name: 'Análisis' }
    ];
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  }

  getCategoryColor(categoryId: string): string {
    const colors: Record<string, string> = {
      'chat': 'primary',
      'image': 'accent',
      'code': 'warn',
      'writing': 'primary',
      'analysis': 'accent'
    };
    return colors[categoryId] || 'primary';
  }

  getCategoryCount(categoryId: string): number {
    // Este método se implementará cuando tengamos los datos
    return 0;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
