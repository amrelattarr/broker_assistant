import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MiniChat } from "../shared/components/mini-chat/mini-chat";
import Swal from 'sweetalert2';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, MiniChat],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
 registrationForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.createForm();
  }


  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  private usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;


    createForm() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(this.usernameRegex)]],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator = (form: FormGroup) => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }

    const { username, email, password } = this.registrationForm.value;

    this.auth.register({ username, email, password }).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Registration completed successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => this.router.navigate(['/login']));
      },
      error: (err) => {
        const message = err?.error?.message || 'Registration failed. Please try again.';
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


