import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { Daum } from '../../models/all-category.interface';

@Component({
  imports: [],
  selector: 'app-popular-categories',
  styleUrl: './popular-categories.component.css',
  templateUrl: './popular-categories.component.html',
})
export class PopularCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  allCategories: WritableSignal<Daum[]> = signal<Daum[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.getCategoriesData();
  }


getCategoriesData(): void {
  this.categoriesService.getAllCategories().subscribe({
    next: (res) => {
      this.allCategories.set(res.data);
      this.loading.set(false);
    },
    error: (err) => {
      console.log(err);
      this.loading.set(false);
    }
  });
}
}