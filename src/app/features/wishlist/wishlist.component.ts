
import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { WishListService } from '../../core/services/wishList/wish-list.service';
import { AddWishlistResponse, RemoveWishlistResponse, WishlistResponse } from '../../core/models/wishlist/wishlist.interface';



@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-wishlist',
  styleUrl: './wishlist.component.css',
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {

  private readonly wishListService = inject(WishListService);
  private readonly platform = inject(PLATFORM_ID);

  wishListData: WritableSignal<WishlistResponse> = signal<WishlistResponse>({
    status: '',
    count: 0,
    data: [],
  });

  isLoading = signal<boolean>(false);

  isRemovingAll = signal<boolean>(false);

  errorMessage = signal<string>('');

  removingProductIds = signal<string[]>([]);

  ngOnInit(): void {
    this.getWishListData();
  }

  getWishListData(): void {
    if (isPlatformBrowser(this.platform)) {
      const token = localStorage.getItem('freshToken');

      if (token) {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.wishListService.getLoggedUserWishList()
          .pipe(
            finalize(() => this.isLoading.set(false))
          )
          .subscribe({
            next: (res: WishlistResponse) => {
              if (res.status === 'success') {
                this.wishListData.set(res);
              }
            },
            error: () => {
              this.errorMessage.set('Something went wrong. Please try again.');
            },
          });
      }
    }
  }

  addProductToWishList(productId: string): void {
    this.wishListService.addProductToWishList(productId)
      .subscribe({
        next: (res: AddWishlistResponse) => {
          if (res.status === 'success') {
            this.getWishListData();
          }
        },
        error: () => {
          this.errorMessage.set('Failed to add product to wishlist.');
        },
      });
  }

  removeProductFromWishList(productId: string): void {

    if (this.isRemovingAll()) return;

    this.removingProductIds.update(ids => [...ids, productId]);

    this.wishListService.removeProductFromWishList(productId)
      .pipe(
        finalize(() => {
          this.removingProductIds.update(
            ids => ids.filter(id => id !== productId)
          );
        })
      )
      .subscribe({
        next: (res: RemoveWishlistResponse) => {
          if (res.status === 'success') {
            this.getWishListData();
          }
        },
        error: () => {
          this.errorMessage.set('Failed to remove product from wishlist.');
        },
      });
  }

  removeAllWishlist(): void {

    const products = this.wishListData().data;

    if (products.length === 0 || this.isRemovingAll()) return;

    this.isRemovingAll.set(true);
    this.errorMessage.set('');

    const removeRequests = products.map(product =>
      this.wishListService.removeProductFromWishList(product._id)
    );

    forkJoin(removeRequests)
      .pipe(
        finalize(() => this.isRemovingAll.set(false))
      )
      .subscribe({
        next: (res) => {
          const allRemoved = res.every(
            response => response.status === 'success'
          );

          if (allRemoved) {
            this.getWishListData();
          } else {
            this.errorMessage.set('Some products could not be removed.');
            this.getWishListData();
          }
        },
        error: () => {
          this.errorMessage.set('Failed to clear wishlist.');
          this.getWishListData();
        },
      });
  }
}
