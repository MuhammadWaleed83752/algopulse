import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
// import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { provideHttpClient } from '@angular/common/http';
import { withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';



bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHotToastConfig({
      reverseOrder: true,
      dismissible: true,
      visibleToasts: 1
    }),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),

    provideHotToastConfig({
      reverseOrder: true,
      dismissible: true,
      visibleToasts: 1
    }),

    {
      provide: 'APP_CONFIG',
      useValue: appConfig
    }
  ],
}).catch((err) => console.error(err));
