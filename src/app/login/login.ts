import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule , RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm!: FormGroup;

  private usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(private fb: FormBuilder, private router: Router) {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(this.usernameRegex)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]]
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login Form Submitted', this.loginForm.value);
      this.router.navigate(['/home']);
    }
    //  else {
    //   console.log('Login Info is invalid');
    // }
  }
}
