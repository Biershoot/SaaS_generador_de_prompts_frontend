import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromptService, PromptRequest, PromptResponse } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-generator',
  templateUrl: './prompt-generator.component.html',
  styleUrls: ['./prompt-generator.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PromptGeneratorComponent {
  promptInput: string = '';
  generatedPrompt: string = '';
  selectedProvider: string = 'gpt-4';
  selectedCategory: string = 'general';
  isLoading: boolean = false;
  errorMessage: string = '';

  // Opciones disponibles
  providers = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3', label: 'Claude 3' },
    { value: 'gemini-pro', label: 'Gemini Pro' }
  ];

  categories = [
    { value: 'general', label: 'General' },
    { value: 'creative', label: 'Creativo' },
    { value: 'business', label: 'Negocios' },
    { value: 'technical', label: 'Técnico' },
    { value: 'writing', label: 'Escritura' },
    { value: 'marketing', label: 'Marketing' }
  ];

  constructor(private promptService: PromptService) {}

  generate() {
    if (!this.promptInput.trim()) {
      this.errorMessage = 'Por favor, ingresa una idea o descripción';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.generatedPrompt = '';

    const requestData: PromptRequest = {
      input: this.promptInput,
      provider: this.selectedProvider,
      category: this.selectedCategory
    };

    this.promptService.generatePrompt(requestData).subscribe({
      next: (response: PromptResponse) => {
        this.generatedPrompt = response.prompt;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error generating prompt:', err);
        this.errorMessage = 'Error al generar el prompt. Intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  savePrompt() {
    if (!this.generatedPrompt) {
      this.errorMessage = 'No hay un prompt generado para guardar';
      return;
    }

    const promptData = {
      input: this.promptInput,
      generatedPrompt: this.generatedPrompt,
      provider: this.selectedProvider,
      category: this.selectedCategory
    };

    this.promptService.savePrompt(promptData).subscribe({
      next: () => {
        this.errorMessage = '';
        // Opcional: mostrar mensaje de éxito
        console.log('Prompt guardado exitosamente');
      },
      error: (err) => {
        console.error('Error saving prompt:', err);
        this.errorMessage = 'Error al guardar el prompt';
      }
    });
  }

  clearForm() {
    this.promptInput = '';
    this.generatedPrompt = '';
    this.errorMessage = '';
    this.selectedProvider = 'gpt-4';
    this.selectedCategory = 'general';
  }

  copyToClipboard() {
    if (this.generatedPrompt) {
      navigator.clipboard.writeText(this.generatedPrompt).then(() => {
        // Opcional: mostrar mensaje de éxito
        console.log('Prompt copiado al portapapeles');
      });
    }
  }
}
