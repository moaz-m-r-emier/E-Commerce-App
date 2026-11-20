import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BrandsResponse } from '../models/brands.interface';

@Service()
export class BrandService {
  private readonly httpClient = inject(HttpClient);

  getAllBrands(): Observable<BrandsResponse> {
    return this.httpClient.get<BrandsResponse>(`${environment.base_url}/api/v1/brands`);
  }
}
