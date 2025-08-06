import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgClass } from '@angular/common';

interface ResponseItem {
  keywords: string[];
  text: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor, NgClass],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat {
  userMessage: string = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [
    { text: "Hello! I’m your Capital Market Broker assistant. How can I help you?", sender: 'bot' }
  ];

  private responses: ResponseItem[] = [
    { keywords: ["broker", "capital market"], text: "A capital market broker helps clients buy and sell securities such as stocks and bonds." },
    { keywords: ["services", "offer"], text: "We offer stock trading, bond investments, portfolio management, and market research." },
    { keywords: ["commission", "fees"], text: "Brokers earn through commissions, fees, or spreads charged on transactions." },
    { keywords: ["trading", "invest"], text: "Trading involves buying and selling securities to profit from price movements, while investing focuses on long-term growth." },
    { keywords: ["account", "open"], text: "To open a trading account, you’ll need to provide identification and proof of address, then deposit funds." },
    { keywords: ["default"], text: "I’m here to assist you with capital market broker–related questions. Could you please clarify?" }
  ];

  sendMessage(): void {
    if (!this.userMessage.trim()) return;
    this.messages.push({ text: this.userMessage, sender: 'user' });
    const messageCopy = this.userMessage;
    this.userMessage = '';
    setTimeout(() => {
      const botReply = this.getBotResponse(messageCopy);
      this.messages.push({ text: botReply, sender: 'bot' });
    }, 500);
  }

  private getBotResponse(userMessage: string): string {
    const lowerMsg = userMessage.toLowerCase();
    for (const r of this.responses) {
      if (r.keywords.some(k => lowerMsg.includes(k))) {
        return r.text;
      }
    }
    return this.responses.find(r => r.keywords.includes("default"))!.text;
  }
}