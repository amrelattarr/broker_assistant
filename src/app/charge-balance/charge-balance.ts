import { Component, inject, OnInit } from '@angular/core';
import { Balance } from '../shared/services/balance';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charge-balance',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './charge-balance.html',
  styleUrl: './charge-balance.css'
})
export class ChargeBalance implements OnInit {
  private readonly balanceService = inject(Balance);
  
  chargeForm = new FormGroup({
    amount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10000)
    ])
  });

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  get amount() {
    return this.chargeForm.get('amount');
  }

  ngOnInit(): void {
    // Initialization if needed
  }

  onSubmit(): void {
    if (this.chargeForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const amount = this.amount?.value;
    
    if (amount === null || amount === undefined) {
      this.errorMessage = 'Please enter a valid amount';
      this.isSubmitting = false;
      return;
    }

    this.balanceService.editBalance(amount).subscribe({
      next: (response: any) => {
        console.log('Balance update response:', response);
        
        // Check if the response has a body with the updated balance
        const updatedBalance = response?.body?.balance;
        if (updatedBalance !== undefined) {
          // Update the local storage with the new balance
          localStorage.setItem('Balance', updatedBalance.toString());
          this.successMessage = `Success! Your new balance is ${updatedBalance} EGP`;
        } else {
          this.successMessage = 'Balance updated successfully!';
        }
        
        this.chargeForm.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error: any) => {
        console.error('Error updating balance:', error);
        
        // Handle different types of errors
        if (error.status === 401) {
          this.errorMessage = 'Your session has expired. Please log in again.';
          // Consider redirecting to login page
          // this.router.navigate(['/login']);
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Invalid request. Please check the amount and try again.';
        } else {
          this.errorMessage = 'Failed to update balance. Please try again later.';
        }
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
