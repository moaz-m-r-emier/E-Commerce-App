import { subscribe } from 'diagnostics_channel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../core/services/payment/payment.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-checkout',
  styleUrl: './checkout.component.css',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);

  cartId: WritableSignal<string> = signal<string>('');
  flag: WritableSignal<string> = signal<string>('cash');

  checkOut!: FormGroup;
  checkoutFormInit(): void {
    this.checkOut = this.fb.group({
      shippingAddress: this.fb.group({
        details: ['', [Validators.required]],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/)],
        ],
        city: ['', [Validators.required]],
      }),
    });
  }
  validateCheckout(): void {
    this.checkOut.markAllAsTouched();

    if (this.checkOut.valid) {
      if (this.flag() === 'cash') {
        this.paymentService.createCashOrder(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.router.navigate(['/allorders']);
            }
          },
        });
      } else if (this.flag() === 'visa') {
        this.paymentService.checkOutSession(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              open(res.session.url, '_self');
            }
          },
        });
      }
    }
  }
  changePaymentMethod(input: HTMLInputElement): void {
    this.flag.set(input.value);
  }
  ngOnInit(): void {
    this.getCartId();
    this.checkoutFormInit();
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.cartId.set(param.get('id')!);
    });
  }
}
