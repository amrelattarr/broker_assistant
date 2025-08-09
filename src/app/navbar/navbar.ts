import { Component , inject} from '@angular/core';
import { RouterLink ,Router , NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar {
  private router = inject(Router);
  currentPath = '';

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.url;
      }
    });
  }

  hideButton() {
    return this.currentPath === '/login' || this.currentPath === '/register' || this.currentPath === '/';
  }
}


