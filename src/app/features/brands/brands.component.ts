import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../core/services/brand.service';
import { Brand } from '../../core/models/cart-data.interface';
import { BrandsResponse } from '../../core/models/brands.interface';


@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {

  private readonly brandService = inject(BrandService);

  brands: Brand[] = [];

  searchTerm = '';

  totalBrands = 0;

  currentPage = 1;

  numberOfPages = 1;

  isLoading = true;

  errorMessage = '';

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.brandService.getAllBrands().subscribe({

      next: (res: BrandsResponse) => {

        this.brands = res.data ?? [];

        this.totalBrands = res.results ?? 0;

        this.currentPage = res.metadata?.currentPage ?? 1;

        this.numberOfPages = res.metadata?.numberOfPages ?? 1;

        this.isLoading = false;

      },

      error: (err) => {

        console.error('Error loading brands:', err);

        this.errorMessage = 'Something went wrong while loading brands.';

        this.isLoading = false;

      },

    });

  }

  get filteredBrands(): Brand[] {

    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.brands;
    }

    return this.brands.filter((brand) =>
      brand.name.toLowerCase().includes(term)
    );

  }

}