import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { AllCategory, Daum } from './../home/models/all-category.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categories = signal<Daum[]>([]);
  searchTerm = signal('');
  isLoading = signal(true);
  errorMessage = signal('');

  filteredCategories = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    if (!search) {
      return this.categories();
    }

    return this.categories().filter(category =>
      category.name.toLowerCase().includes(search)
    );
  });

  ngOnInit(): void {
    this.getCategoriesData();
  }

  getCategoriesData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Something went wrong while loading categories.');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}