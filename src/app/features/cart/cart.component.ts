import { subscribe } from 'diagnostics_channel';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { CartData } from '../../core/models/cart-data.interface';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';

@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-cart',
  styleUrl: './cart.component.css',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly platform = inject(PLATFORM_ID);
  cartDetailsData: WritableSignal<CartData> = signal<CartData>({} as CartData);

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    if (isPlatformBrowser(this.platform)) {
      const token = localStorage.getItem('freshToken');
      if (token) {
        this.cartService.getLoggedUserCart().subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.cartDetailsData.set(res.data);
            }
          },
        });
      }
    }
  }
  removeItemFromCart(productId: string): void {
    this.cartService.removeProductFromCart(productId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartDetailsData.set(res.data);
          this.cartService.cartCount.set(res.numOfCartItems);
        }
      },
    });
  }
  updateProductQuantity(productId: string, count: number): void {
    this.cartService.updateCartProductQuantity(productId, count).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartDetailsData.set(res.data);
          this.cartService.cartCount.set(res.numOfCartItems);
        }
      },
    });
  }
  clearAllItemFromCart(): void {
    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        if (res.status) {
          this.cartDetailsData.set(res.data);
          this.cartService.cartCount.set(res.numOfCartItems);
        }
      },
    });
  }
}
