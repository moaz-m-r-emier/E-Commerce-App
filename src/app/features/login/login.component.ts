import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);


  loginForm: FormGroup;

  showPassword = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService.signIn(this.loginForm.value).subscribe({
      next: (res) => {
        if(res.message === 'success'){
          localStorage.setItem('freshToken',res.token);
          localStorage.setItem('userData' , JSON.stringify(res.user));
          this.authService.isLogged.set(true);

          this.router.navigate(['/'])
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.isSubmitting = false;
  }
}
