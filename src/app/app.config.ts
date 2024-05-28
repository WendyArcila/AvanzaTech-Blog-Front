import { ApplicationConfig } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http'

import { routes } from './app.routes';
import { sessionInterceptor } from './domains/shared/interceptors/session.interceptor';
import { CustomRouteReuseStrategy } from './domains/utils/routeruse';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([sessionInterceptor])
    )
    ]
};
