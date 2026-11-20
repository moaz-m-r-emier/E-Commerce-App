
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AddWishlistResponse, RemoveWishlistResponse, WishlistResponse } from '../../models/wishlist/wishlist.interface';



@Injectable({
  providedIn: 'root',
})
export class WishListService {

  private readonly httpClient = inject(HttpClient);

  wishlistCount = signal<number>(0);

  addProductToWishList(id: string): Observable<AddWishlistResponse> {
    return this.httpClient.post<AddWishlistResponse>(
      `${environment.base_url}/api/v1/wishlist`,
      { productId: id }
    ).pipe(
      tap(res => {
        if (res.status === 'success') {
          this.wishlistCount.set(res.data.length);
        }
      })
    );
  }

  getLoggedUserWishList(): Observable<WishlistResponse> {
    return this.httpClient.get<WishlistResponse>(
      `${environment.base_url}/api/v1/wishlist`
    ).pipe(
      tap(res => {
        if (res.status === 'success') {
          this.wishlistCount.set(res.count);
        }
      })
    );
  }

  removeProductFromWishList(
    productId: string
  ): Observable<RemoveWishlistResponse> {
    return this.httpClient.delete<RemoveWishlistResponse>(
      `${environment.base_url}/api/v1/wishlist/${productId}`
    );
  }
}
