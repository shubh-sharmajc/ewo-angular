import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';
import {CookieBackendService, CookieService} from 'ngx-cookie';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {LocalStorage} from './_services/local-storage/local-storage.service';
import {InlineStyleComponent} from './inline-style/inline-style.component';
import {InlineStyleModule} from './inline-style/inline-style.module';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    ModuleMapLoaderModule,
    InlineStyleModule
  ],
  providers: [
    // Add universal-only providers here
    {provide: CookieService, useClass: CookieBackendService},
    {
      provide: LocalStorage, useValue: {
        getItem() {
        }, setItem() {
        }, removeItem() {
        }
      }
    }
  ],
  bootstrap: [AppComponent, InlineStyleComponent],
})
export class AppServerModule {
}
