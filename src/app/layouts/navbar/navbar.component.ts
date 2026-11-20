import { Component, computed, inject, OnInit, PLATFORM_ID, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { WishListService } from '../../core/services/wishList/wish-list.service';

@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly authService = inject(AuthService);
  private readonly platform = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishListService);

  wishlistCount = this.wishListService.wishlistCount;
  logged: Signal<boolean> = computed(() => this.authService.isLogged());
  count: Signal<number> = computed(() => this.cartService.cartCount());

  ngOnInit(): void {
    this.checkUserToken();
    this.flowbiteInit();
        this.getWishlistCount();

  }

  checkUserToken(): void {
    if (isPlatformBrowser(this.platform)) {
      const token = localStorage.getItem('freshToken');
      if (token) {
        this.authService.isLogged.set(true);
        this.getCartCount();
      }
    }
  }

  flowbiteInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  logOut(): void {
    this.authService.signOut();
  }

  getCartCount(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
      },
    });
  }

    getWishlistCount(): void {
    if (isPlatformBrowser(this.platform)) {
      const token = localStorage.getItem('freshToken');

      if (token) {
        this.wishListService.getLoggedUserWishList().subscribe();
      }
    }
  }

}
