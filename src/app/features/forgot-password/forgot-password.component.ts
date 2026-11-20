import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-forgot-password',
  styleUrl: './forgot-password.component.css',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  step: WritableSignal<number> = signal<number>(1);

  emailControl: WritableSignal<FormControl> = signal<FormControl>(
    new FormControl('', [Validators.required, Validators.email]),
  );
  resetCodeControl: WritableSignal<FormControl> = signal<FormControl>(
    new FormControl('', [Validators.required]),
  );
  newPasswordControl: WritableSignal<FormControl> = signal<FormControl>(
    new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    ]),
  );

  submitEmail(e: SubmitEvent): void {
    e.preventDefault();

    if (this.emailControl().invalid) {
      this.emailControl().markAsTouched();
      this.emailControl().markAsDirty();
      return;
    }

    const data = {
      email: this.emailControl().value,
    };

    this.authService.forgotPassword(data).subscribe({
      next: (res) => {
        if (res.statusMsg === 'success') {
          this.toastrService.success(res.message,'Fresh Cart', {
      closeButton:true ,
       timeOut:2000,
       progressBar:true
    })
       setTimeout(()=>{
          this.step.set(2);

       },1000)
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    // call api
  }

  submitResetCode(e: SubmitEvent): void {
    e.preventDefault();

    if (this.resetCodeControl().invalid) {
      this.resetCodeControl().markAsTouched();
      this.resetCodeControl().markAsDirty();
      return;
    }

    const data = {
      resetCode: this.resetCodeControl().value,
    };

    this.authService.verifyResetCode(data).subscribe({
      next: (res) => {
        if (res.status === 'Success') {
          this.toastrService.success('Code verified successfully','Fresh Cart', {
      closeButton:true ,
       timeOut:1000,
       progressBar:true
    })
    setTimeout(() => {
      
      this.step.set(3);
    }, 1000);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    // call api
  }

  submitNewPassword(e: SubmitEvent): void {
    e.preventDefault();

    if (this.newPasswordControl().invalid) {
      this.newPasswordControl().markAsTouched();
      this.newPasswordControl().markAsDirty();
      return;
    }

    const data = {
      email: this.emailControl().value,
      newPassword: this.newPasswordControl().value,
    };

    this.authService.resetPassword(data).subscribe({
      next: (res) => {
this.toastrService.success('Password Reset successfully','Fresh Cart', {
      closeButton:true ,
       timeOut:1000,
       progressBar:true
    })

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.log(err);
      },
    });

    // call api
  }
}
