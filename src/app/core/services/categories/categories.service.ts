import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AllCategory, AllCategoryResponse } from '../../../features/home/models/all-category.interface';

@Service()
export class CategoriesService {
    private readonly httpClient = inject(HttpClient);


    getAllCategories():Observable<AllCategoryResponse>{
    return this.httpClient.get<AllCategoryResponse>(`${environment.base_url}/api/v1/categories`)
    }


    getSpecificCategories(categoryId:string):Observable<any>{
    return this.httpClient.get<any>(`${environment.base_url}/api/v1/categories/${categoryId}`)
    }
}
