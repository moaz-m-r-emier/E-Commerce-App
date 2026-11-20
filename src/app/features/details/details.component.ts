import { ProductDetailsData } from './../../core/models/product-details-data.interface';
import { Component, inject, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/products/product.service';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Products } from '../../core/models/products.interface';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-details',
  styleUrl: './details.component.css',
  templateUrl: './details.component.html',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  productId: WritableSignal<string> = signal<string>('');



  productData: WritableSignal<ProductDetailsData> = signal<ProductDetailsData>(
    {} as ProductDetailsData,
  );

  ngOnInit(): void {
    this.getProductId();
  }

  getProductId(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.productId.set(param.get('id')!);

      this.getSpecificProductData();
    });
  }

  getSpecificProductData(): void {
    this.productService.getSpecificProduct(this.productId()).subscribe({
      next: (res) => {
        this.productData.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


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
}
