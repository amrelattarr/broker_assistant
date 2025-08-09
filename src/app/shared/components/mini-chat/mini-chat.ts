import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrokerService } from '../../services/broker';

interface ChatMessage {
  text: string;
  from: 'user' | 'bot';
}

@Component({
  selector: 'app-mini-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './mini-chat.html',
  styleUrls: ['./mini-chat.css']
})
export class MiniChat {
  isOpen = false;
  messages: ChatMessage[] = [
    { text: 'Hello! I am your Capital Market Broker assistant. How can I help you today?', from: 'bot' }
  ];
  userInput = '';
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  private brokerService = inject(BrokerService);

  showHint = false;
  private hintInterval: any;
  
  ngOnInit() {
    this.hintInterval = setInterval(() => {
      if (!this.isOpen) {
        this.showHint = true;
        setTimeout(() => this.showHint = false, 4000);
      }
    }, 5000);
  }
  
  ngOnDestroy() {
    if (this.hintInterval) {
      clearInterval(this.hintInterval);
    }
  }
  
  openChat() {
    this.isOpen = true;
    this.showHint = false;
    setTimeout(() => this.scrollToBottom(), 200);
  }
  
  closeChat() {
    this.isOpen = false;
  }
  

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ text: this.userInput, from: 'user' });
    const userMsg = this.userInput;
    this.userInput = '';
    setTimeout(() => this.scrollToBottom(), 100);

    const reply = this.brokerService.getAnswer(userMsg);
    setTimeout(() => {
      this.messages.push({ text: reply, from: 'bot' });
      this.scrollToBottom();
    }, 500);
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
