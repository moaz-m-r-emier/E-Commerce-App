import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { Products } from '../../core/models/products.interface';
import { ProductService } from '../../core/services/products/product.service';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination'; // <-- import the module
import { RouterLink } from '@angular/router';

@Component({
  imports: [CardComponent, RouterLink, NgxPaginationModule],
  selector: 'app-shop',
  styleUrl: './shop.component.css',
  templateUrl: './shop.component.html',
})
export class ShopComponent {
  private readonly productService = inject(ProductService);

  productsList: WritableSignal<Products[]> = signal<Products[]>([]);

  pageSize: WritableSignal<number> = signal<number>(0);
  p: WritableSignal<number> = signal<number>(0);
  total: WritableSignal<number> = signal<number>(0);

  pagination: WritableSignal<PaginationInstance> = signal({
    id: 'foo',
    itemsPerPage: this.pageSize(),
    currentPage: this.p(),
    totalItems: this.total(),
  });

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(): void {
    this.productService
      .getAllProducts(this.pagination().currentPage, this.pagination().itemsPerPage)
      .subscribe({
        next: (res) => {
          this.productsList.set(res.data);
          this.pagination().itemsPerPage = res.metadata.limit;
          this.pagination().currentPage = res.metadata.currentPage;
          this.pagination().totalItems = res.results;
        },
      });
  }
  pageChanged(page: number): void {
    this.pagination().currentPage = page;
    this.getAllData();
  }
}
