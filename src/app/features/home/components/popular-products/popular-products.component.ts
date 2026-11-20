import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Products } from '../../../../core/models/products.interface';
import { ProductService } from '../../../../core/services/products/product.service';
import { CardComponent } from '../../../../shared/ui/card/card.component';

@Component({
  imports: [ CardComponent],
  selector: 'app-popular-products',
  styleUrl: './popular-products.component.css',
  templateUrl: './popular-products.component.html',
})
export class PopularProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);


  productsList: WritableSignal<Products[]> = signal<Products[]>([]);

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.productsList.set(res.data);
      },
    });
  }

}
