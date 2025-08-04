import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./login/login";
import { Chat } from "./chat/chat";
import { Navbar } from "./navbar/navbar";
import { Register } from "./register/register";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Chat, Navbar, Register],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'chatbot';
}
