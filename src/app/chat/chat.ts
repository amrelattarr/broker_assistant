import { Component , inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { BrokerService } from '../shared/services/broker';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat {
  userMessage: string = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [
    { text: "Hello! I’m your Capital Market Broker assistant. How can I help you?", sender: 'bot' }
  ];

  private brokerService = inject(BrokerService);

  sendMessage(): void {
    if (!this.userMessage.trim()) return;
    this.messages.push({ text: this.userMessage, sender: 'user' });
    const question = this.userMessage;
    this.userMessage = '';
    const answer = this.brokerService.getAnswer(question);
    this.messages.push({ text: answer, sender: 'bot' });
  }
}