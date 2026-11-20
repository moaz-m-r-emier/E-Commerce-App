import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorsInterceptor } from './core/interceptor/errors/errors-interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './core/interceptor/loading/loading-interceptor';
import { headersInterceptor } from './core/interceptor/headers/headers-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,

      withViewTransitions({skipInitialTransition:true}),
      withInMemoryScrolling({scrollPositionRestoration:'top'}),
      
    ), 
    provideClientHydration(),
     provideToastr(),
     provideHttpClient(withInterceptors([errorsInterceptor,loadingInterceptor,headersInterceptor])) ,
     importProvidersFrom(NgxSpinnerModule)
  ]
};
