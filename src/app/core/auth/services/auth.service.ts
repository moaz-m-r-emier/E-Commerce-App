import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserDataResponse } from '../../models/user-data.interface';
import { ForgotPassEmailResponse } from '../../models/forgot-pass-email.interface';
import { Router } from '@angular/router';

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  isLogged:WritableSignal<boolean>=signal<boolean>(false);

  signUp(data: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(
      `${environment.base_url}/api/v1/auth/signup`,
      data,
    );
  }

  signIn(data: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(
      `${environment.base_url}/api/v1/auth/signin`,
      data,
    );
  }
  signOut():void{
   localStorage.removeItem('freshToken');
   localStorage.removeItem('userData');
   this.isLogged.set(false);
   this.router.navigate(['/login'])
  }

  forgotPassword(data: object): Observable<ForgotPassEmailResponse> {
    return this.httpClient.post<ForgotPassEmailResponse>(`${environment.base_url}/api/v1/auth/forgotPasswords`, data);
  }

  verifyResetCode(data: object): Observable<any> {
    return this.httpClient.post<any>(`${environment.base_url}/api/v1/auth/verifyResetCode`, data);
  }

  resetPassword(data: object): Observable<any> {
    return this.httpClient.put<any>(`${environment.base_url}/api/v1/auth/resetPassword`, data);
  }
}
