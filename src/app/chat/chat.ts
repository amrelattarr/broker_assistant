import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrokerService, ChatBotResponse } from '../shared/services/broker';
import { finalize, catchError, of } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass, RouterModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat {
  userMessage: string = '';
  isLoading = false;
  messages: { 
    text: string; 
    sender: 'user' | 'bot';
    isLink?: boolean;
    link?: string;
    linkText?: string;
  }[] = [
    { text: "Hello! I'm your Capital Market Broker assistant. How can I help you?", sender: 'bot' }
  ];

  private brokerService = inject(BrokerService);

  sendMessage(): void {
    const message = this.userMessage.trim();
    if (!message) return;
    
    // Add user message to chat
    this.messages.push({ text: message, sender: 'user' });
    this.userMessage = '';
    this.isLoading = true;
    
    console.log('Sending message to API:', message);

    // Call the chatbot API
    this.brokerService.askChatBot(message)
      .pipe(
        finalize(() => this.isLoading = false),
        catchError((error) => {
          console.error('API Error:', error);
          this.messages.push({
            text: '⚠️ Sorry, I encountered an error while processing your request. Please try again later.',
            sender: 'bot'
          });
          return of(null);
        })
      )
      .subscribe({
        next: (response: ChatBotResponse | null) => {
          if (!response) return; // Handle case where error was caught
          
          console.log('API Response:', response);
          // Store stockId in local storage if it exists in the response
          if (response.stockId) {
            localStorage.setItem('highlightedStockId', response.stockId.toString());
          }
          
          // Add bot's response to chat
          this.messages.push({ 
            text: response.answer, 
            sender: 'bot' 
          });
          
          // Add reference if available
          if (response.referenceUsed) {
            this.messages.push({
              text: `📊 ${response.referenceUsed}`,
              sender: 'bot',
            });
          }
          
          // Add additional advice if available
          if (response.adviceGiven) {
            this.messages.push({
              text: `💡 ${response.adviceGiven}`,
              sender: 'bot'
            });
          }
          
          // Add clickable stocks link after every response
          this.messages.push({
            text: '🔍 Explore more stocks',
            isLink: true,
            link: '/stocks',
            linkText: 'View All Stocks',
            sender: 'bot'
          });
        }
      });
  }
}