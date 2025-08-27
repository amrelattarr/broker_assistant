import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MiniChat } from "../shared/components/mini-chat/mini-chat";
import Swal from 'sweetalert2';
import { AuthService } from "../shared/services/auth.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule, CommonModule, MiniChat],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm!: FormGroup;

  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]]
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        try {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('email', JSON.stringify(res.user.email));
          localStorage.setItem('username', JSON.stringify(res.user.username));
          localStorage.setItem('Balance', JSON.stringify(res.user.balance));

        } catch {}
        Swal.fire({
          title: 'Login Successful!',
          text: 'Welcome back!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => this.router.navigate(['/home']));
      },
      error: (err) => {
        const message = err?.error?.message || 'Login failed. Please check your credentials.';
        Swal.fire({
          title: 'Error',
          text: message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
