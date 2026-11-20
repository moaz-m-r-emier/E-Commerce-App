import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Fresh Cart | Home',
    loadComponent: () =>
      import('./features/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },

  {
    path: 'brands',
    title: 'Fresh Cart | Brands',
    loadComponent: () =>
      import('./features/brands/brands.component').then(
        (c) => c.BrandsComponent
      ),
  },
  {
    path: 'shop',
    title: 'Fresh Cart | Shop',
    loadComponent: () =>
      import('./features/shop/shop.component').then(
        (c) => c.ShopComponent
      ),
  },

  {
    path: 'categories',
    title: 'Fresh Cart | Categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then(
        (c) => c.CategoriesComponent
      ),
  },

  {
    path: 'details/:slug/:id',
    title: 'Fresh Cart | Product Details',
    loadComponent: () =>
      import('./features/details/details.component').then(
        (c) => c.DetailsComponent
      ),
  },

  {
    path: 'cart',
    title: 'Fresh Cart | Cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cart/cart.component').then(
        (c) => c.CartComponent
      ),
  },

  {
    path: 'wishlist',
    title: 'Fresh Cart | Wishlist',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then(
        (c) => c.WishlistComponent
      ),
  },

  {
    path: 'checkout/:id',
    title: 'Fresh Cart | Checkout',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/checkout/checkout.component').then(
        (c) => c.CheckoutComponent
      ),
  },

  {
    path: 'allorders',
    title: 'Fresh Cart | Orders',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/allorders/allorders.component').then(
        (c) => c.AllordersComponent
      ),
  },

  {
    path: 'login',
    title: 'Fresh Cart | Login',
    loadComponent: () =>
      import('./features/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },

  {
    path: 'register',
    title: 'Fresh Cart | Register',
    loadComponent: () =>
      import('./features/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },

  {
    path: 'forgotPassword',
    title: 'Fresh Cart | Forgot Password',
    loadComponent: () =>
      import('./features/forgot-password/forgot-password.component').then(
        (c) => c.ForgotPasswordComponent
      ),
  },

  {
    path: '**',
    title: 'Fresh Cart | Page Not Found',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
  },
];