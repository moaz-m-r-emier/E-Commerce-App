import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ProductsResponse } from '../../models/products.interface';
import { ProductDetailsDataResponse } from '../../models/product-details-data.interface';

@Service()
export class ProductService {
  private readonly httpClient = inject(HttpClient);

  getAllProducts(page:number =1 , limit:number = 10): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>(`${environment.base_url}/api/v1/products?page=${page}&limit=${limit}`);
  }

  getSpecificProduct(productId: string): Observable<ProductDetailsDataResponse> {
  return this.httpClient.get<ProductDetailsDataResponse>(
    `${environment.base_url}/api/v1/products/${productId}`
  );
}
}
