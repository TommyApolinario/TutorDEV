import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

const combinedConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), 
    provideAnimations(),
    provideToastr(),
  ],
};

bootstrapApplication(AppComponent, combinedConfig)
  .catch((err) => console.error(err));