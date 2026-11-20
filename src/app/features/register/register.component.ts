import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerForm: FormGroup;

  showPassword = false;
  showrePassword = false;

  isSubmitting = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/\S/)]],

        email: ['', [Validators.required, Validators.email]],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/),
          ],
        ],

        rePassword: ['', [Validators.required]],

        phone: ['', [Validators.required, Validators.pattern(/^(?:\+20|0020|0)1[0125]\d{8}$/)]],

        terms: [false, [Validators.requiredTrue]],
      },
      {
        validators: [this.passwordMatchValidator],
      },
    );

    // Revalidate the confirmation field whenever
    // the original password changes.
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('rePassword')?.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
    });
  }

  // Check whether passwords match.
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;

    // The required validator handles an empty confirmation.
    if (!rePassword || !password) {
      return null;
    }

    return password === rePassword ? null : { passwordMismatch: true };
  }

  // Check whether a field should display its errors.
  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);

    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // Check password mismatch independently of field-level errors.
  get passwordsMismatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const rePassword = this.registerForm.get('rePassword')?.value;

    return (
      !!password &&
      !!rePassword &&
      password !== rePassword &&
      (this.registerForm.get('rePassword')?.touched === true ||
        this.registerForm.get('rePassword')?.dirty === true)
    );
  }

  // Return a useful validation message for each field.
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);

    if (!control || !control.errors) {
      return '';
    }

    if (control.hasError('required')) {
      const messages: Record<string, string> = {
        name: 'Full name is required.',
        email: 'Email address is required.',
        password: 'Password is required.',
        rePassword: 'Please confirm your password.',
        phone: 'Phone number is required.',
      };

      return messages[controlName] || 'This field is required.';
    }

    if (control.hasError('requiredTrue')) {
      return 'You must accept the terms to continue.';
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    if (control.hasError('minlength')) {
      if (controlName === 'name') {
        return 'Full name must contain at least 2 characters.';
      }

      if (controlName === 'password') {
        return 'Password must contain at least 8 characters.';
      }
    }

    if (control.hasError('pattern')) {
      if (controlName === 'name') {
        return 'Please enter a valid full name.';
      }

      if (controlName === 'password') {
        return 'Use uppercase, lowercase, a number, and a special character.';
      }

      if (controlName === 'phone') {
        return 'Enter a valid Egyptian mobile number.';
      }
    }

    return 'Please check this field.';
  }

  onSubmit(): void {
    this.errorMessage = '';

    // Reveal errors for all fields when Submit is clicked.
    this.registerForm.markAllAsTouched();

    // Never submit an invalid form.
    if (this.registerForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;



    this.authService.signUp(this.registerForm.value).subscribe({
      next:(res)=>{
       if(res.message== 'success'){
        this.router.navigate(['/login'])
       }
      },
      error:(err)=>{
        console.log(err);
      }
    })

    this.isSubmitting = false;
  }
}
