import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../service/chatbot.services';

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [CommonModule, FormsModule],
})
export class Chat implements OnDestroy {
  constructor(private chatbotService: ChatbotService) {}

  messages = signal<{ role: 'user' | 'bot', text: string }[]>([]);
  userInput = signal('');

  sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;

    this.messages.update(msgs => [...msgs, { role: 'user', text }]);
    this.userInput.set('');

    this.chatbotService.askLLM(text).subscribe({
      next: (response) => {
        const reply = typeof response === 'string' ? response : response.text;
        this.messages.update(msgs => [...msgs, { role: 'bot', text: reply }]);
      },
      error: (err) => {
        this.messages.update(msgs => [
          ...msgs,
          { role: 'bot', text: 'Sorry, there was an error connecting to the AI.' }
        ]);
      }
    });
  }

  ngOnDestroy() {}
}
