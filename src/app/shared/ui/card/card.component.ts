import { Component, inject, input, Input, InputSignal } from '@angular/core';
import { ProductDetailsData } from '../../../core/models/product-details-data.interface';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../core/services/cart/cart.service';
import { Products } from '../../../core/models/products.interface';
import { WishListService } from '../../../core/services/wishList/wish-list.service';

@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-card',
  styleUrl: './card.component.css',
  templateUrl: './card.component.html',
})
export class CardComponent {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishListService = inject(WishListService);

  product: InputSignal<Products> = input.required();

  addProductItemToYourCart(productId: string): void {
    const token = localStorage.getItem('freshToken');

    if (token) {
      this.cartService.addProductToCart(productId).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toastrService.success(res.message, 'Fresh Cart', {
              closeButton: true,
              progressBar: true,
              progressAnimation: 'increasing',
              timeOut: 2000,
            });

            this.cartService.cartCount.set(res.numOfCartItems);
          }
        },
      });
    } else {
      this.toastrService.warning('Please Login To Continue', 'Fresh Cart', {
        closeButton: true,
        progressBar: true,
        progressAnimation: 'increasing',
        timeOut: 2500,
      });
    }
  }

addProductToWishList(productId: string): void {
  const token = localStorage.getItem('freshToken');

  if (token) {
    this.wishListService.addProductToWishList(productId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(
            res.message,
            'Fresh Wishlist',
            {
              closeButton: true,
              progressBar: true,
              progressAnimation: 'increasing',
              timeOut: 2000,
            }
          );

     this.wishListService.wishlistCount.set(res.data.length);
        }
      },
    });
  } else {
    this.toastrService.warning(
      'Please Login To Continue',
      'Fresh Wishlist',
      {
        closeButton: true,
        progressBar: true,
        progressAnimation: 'increasing',
        timeOut: 2500,
      }
    );
  }
}
}
