import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import { heroPlusCircle, heroUserPlus, heroDocumentPlus,heroMagnifyingGlass, heroHomeModern  } from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
     provideIcons({
      heroPlusCircle,
      heroUserPlus,
      heroDocumentPlus,
      heroMagnifyingGlass,
      heroHomeModern 
    }),   
  ]
};
