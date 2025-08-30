import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-prompt-generator',
  templateUrl: './prompt-generator.component.html',
  styleUrls: ['./prompt-generator.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ]
})
export class PromptGeneratorComponent {
  promptInput = '';
  generatedPrompt = '';
  selectedProvider = 'openai';
  selectedCategory = 'chat';
  isLoading = false;
  errorMessage = '';
  activeTab = 'generator';
  characterCount = 0;
  maxCharacters = 500;

  // Opciones disponibles
  providers = [
    { value: 'openai', label: 'OpenAI (GPT)' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3', label: 'Claude 3' },
    { value: 'gemini-pro', label: 'Gemini Pro' }
  ];

  categories = [
    { value: 'chat', label: 'Chat' },
    { value: 'creative', label: 'Creativo' },
    { value: 'business', label: 'Negocios' },
    { value: 'technical', label: 'Técnico' },
    { value: 'writing', label: 'Escritura' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'video', label: 'Video' },
    { value: 'social', label: 'Redes Sociales' }
  ];

  // Datos de ejemplo para las pestañas
  historyPrompts: any[] = [];
  favoritePrompts: any[] = [];
  categoryPrompts: any[] = [];

  constructor(private snackBar: MatSnackBar) {}

  onPromptInputChange() {
    this.characterCount = this.promptInput.length;
  }

  generate() {
    if (!this.promptInput.trim()) {
      this.snackBar.open('Por favor, ingresa una idea o descripción', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    if (this.promptInput.length < 5) {
      this.snackBar.open('El prompt debe tener al menos 5 caracteres', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulación de generación de prompt
    setTimeout(() => {
      this.generatedPrompt = `Basándome en tu solicitud: "${this.promptInput}", aquí tienes un prompt optimizado para ${this.selectedProvider} en la categoría ${this.selectedCategory}:

"Eres un experto creador de contenido para YouTube especializado en videos extremos. Necesito que me ayudes a crear un prompt detallado para generar contenido viral sobre [tema específico]. El video debe ser emocionante, atractivo y optimizado para el algoritmo de YouTube. Incluye sugerencias para:
- Hook inicial impactante
- Elementos visuales llamativos
- Música de fondo apropiada
- Transiciones dinámicas
- Call-to-action efectivo
- Hashtags relevantes

El contenido debe ser apropiado para todas las edades y cumplir con las políticas de YouTube."`;

      this.isLoading = false;
      
      // Agregar al historial
      this.historyPrompts.unshift({
        id: Date.now(),
        input: this.promptInput,
        generated: this.generatedPrompt,
        provider: this.selectedProvider,
        category: this.selectedCategory,
        timestamp: new Date(),
        isFavorite: false
      });

      this.snackBar.open('¡Prompt generado exitosamente!', 'OK', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }, 2000);
  }

  clearForm() {
    this.promptInput = '';
    this.generatedPrompt = '';
    this.errorMessage = '';
    this.characterCount = 0;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Copiado al portapapeles', 'OK', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
  }

  toggleFavorite(prompt: any) {
    prompt.isFavorite = !prompt.isFavorite;
    
    if (prompt.isFavorite) {
      this.favoritePrompts.unshift(prompt);
      this.snackBar.open('Agregado a favoritos', 'OK', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } else {
      this.favoritePrompts = this.favoritePrompts.filter(p => p.id !== prompt.id);
      this.snackBar.open('Removido de favoritos', 'OK', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }

  deletePrompt(prompt: any, list: any[]) {
    const index = list.findIndex(p => p.id === prompt.id);
    if (index > -1) {
      list.splice(index, 1);
      this.snackBar.open('Prompt eliminado', 'OK', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }

  getCategoryLabel(value: string): string {
    const category = this.categories.find(c => c.value === value);
    return category ? category.label : value;
  }

  getProviderLabel(value: string): string {
    const provider = this.providers.find(p => p.value === value);
    return provider ? provider.label : value;
  }

  getCategoryIcon(value: string): string {
    const iconMap: Record<string, string> = {
      'chat': 'chat',
      'creative': 'palette',
      'business': 'business',
      'technical': 'code',
      'writing': 'edit',
      'marketing': 'trending_up',
      'video': 'video_library',
      'social': 'share'
    };
    return iconMap[value] || 'category';
  }

  getCategoryDescription(value: string): string {
    const descriptionMap: Record<string, string> = {
      'chat': 'Prompts para conversaciones y diálogos',
      'creative': 'Prompts para contenido creativo y artístico',
      'business': 'Prompts para negocios y emprendimiento',
      'technical': 'Prompts para desarrollo y tecnología',
      'writing': 'Prompts para escritura y redacción',
      'marketing': 'Prompts para marketing y publicidad',
      'video': 'Prompts para contenido de video',
      'social': 'Prompts para redes sociales'
    };
    return descriptionMap[value] || 'Descripción no disponible';
  }

  selectCategory(categoryValue: string) {
    this.selectedCategory = categoryValue;
    this.activeTab = 'generator'; // Cambiar a la pestaña del generador
  }
}
