// angular
import {NgModule} from '@angular/core';
import {BrowserTransferStateModule} from '@angular/platform-browser';
// libs
import {REQUEST} from '@nguniversal/express-engine/tokens';
// components
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {InlineStyleModule} from './inline-style/inline-style.module';
import {InlineStyleComponent} from './inline-style/inline-style.component';
import {LocalStorage} from './_services/local-storage/local-storage.service';

// the Request object only lives on the server
export function getRequest(): any {
  return {headers: {cookie: document.cookie}};
}

@NgModule({
  bootstrap: [AppComponent, InlineStyleComponent],
  imports: [AppModule, BrowserTransferStateModule, InlineStyleModule],
  providers: [
    {provide: REQUEST, useFactory: getRequest}, // The server provides these in main.server
    {provide: LocalStorage, useValue: navigator.cookieEnabled ? window.localStorage : ''}
  ],
})
export class AppBrowserModule {
}
