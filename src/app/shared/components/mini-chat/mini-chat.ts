import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BrokerService, ChatBotResponse } from '../../services/broker';
import { AuthService } from '../../services/auth.service';
import { catchError, finalize, of } from 'rxjs';

interface ChatMessage {
  text: string;
  from: 'user' | 'bot';
}

@Component({
  selector: 'app-mini-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, RouterModule],
  templateUrl: './mini-chat.html',
  styleUrls: ['./mini-chat.css']
})
export class MiniChat {
  isOpen = false;
  messages: ChatMessage[] = [
    { text: 'Hello! I am your Capital Market Broker assistant. How can I help you today?', from: 'bot' }
  ];
  userInput = '';
  isLoading = false;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  private brokerService = inject(BrokerService);
  private authService = inject(AuthService);
  private router = inject(Router);

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
  

  private isUserLoggedIn(): boolean {
    // Check if token exists in localStorage
    return !!localStorage.getItem('token');
  }

  sendMessage() {
    const message = this.userInput.trim();
    if (!message) return;
    
    // Add user message to chat
    this.messages.push({ text: message, from: 'user' });
    this.userInput = '';
    this.isLoading = true;
    this.scrollToBottom();

    // Check if user is logged in
    if (!this.isUserLoggedIn()) {
      this.messages.push({
        text: 'Please login to get more information. If you don\'t have an account, please register first.',
        from: 'bot'
      });
      this.isLoading = false;
      this.scrollToBottom();
      // Optionally, you can automatically open the login page
      // this.router.navigate(['/login']);
      return;
    }

    // User is logged in, proceed with chatbot API
    this.brokerService.askChatBot(message)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.scrollToBottom();
        }),
        catchError(error => {
          console.error('Error getting response from chatbot:', error);
          this.messages.push({
            text: 'Sorry, I encountered an error. Please try again later.',
            from: 'bot'
          });
          return of(null);
        })
      )
      .subscribe((response: ChatBotResponse | null) => {
        if (!response) return; // Error was already handled
        
        // Add bot's response
        this.messages.push({ 
          text: response.answer, 
          from: 'bot' 
        });
        
        // Add reference if available
        if (response.referenceUsed) {
          this.messages.push({
            text: `📊 ${response.referenceUsed}`,
            from: 'bot'
          });
        }
        
        // Add advice if available
        if (response.adviceGiven) {
          this.messages.push({
            text: `💡 ${response.adviceGiven}`,
            from: 'bot'
          });
        }
      });
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
