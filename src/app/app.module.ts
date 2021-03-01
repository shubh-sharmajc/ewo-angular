import {BrowserModule} from '@angular/platform-browser';
import {APP_ID, APP_INITIALIZER, Inject, NgModule, PLATFORM_ID} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {isPlatformBrowser} from '@angular/common';
import {MatDialogModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {ActionReducerMap, StoreModule} from '@ngrx/store';
import {NgxSpinnerModule} from 'ngx-spinner';
import {CookieModule, CookieService} from 'ngx-cookie';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {AppRoutingModule} from './app-routing.module';
import {SignUpPopupModule} from './modal/sign-up-popup/sign-up-popup.module';
import {AlertModule} from './modal/alert/alert.module';
import {CompleteRegistrationModule} from './modal/complete-registration/complete-registration.module';
import {ThirdPartyCookiesModule} from './modal/third-party-cookies/third-party-cookies.module';
import {CreateMediaBookModule} from './modules/media-books/create-media-book/create-media-book.module';

import {environment} from '../environments/environment';
import {AppComponent} from './app.component';

import {UniversalStorageService} from './_services/universal-storage-service/universal-storage.service';
import {StartupService} from './_services/startup/startup.service';
import {ProUserService} from './_services/pro-user/pro-user.service';
import {JwtInterceptor} from './_helpers';

import {loginReducer} from './store/reducers/login-reducer';
import {userReducer} from './store/reducers/user-reducer';
import {nodeBBReducer} from './store/reducers/nodebb-reducer';
import {mediaBookReducer} from './store/reducers/media-book-reducer';
import {imageGalleryReducer} from './store/reducers/image-gallery-reducer';
import {configReducer} from './store/reducers/configuration-reducer';
import {proReducer} from './store/reducers/pro-reducer';
import {proReviewReducer} from './store/reducers/pro-review-reducer';
import { CustomvalidationService } from './_helpers/customvalidation.service';

const reducers: ActionReducerMap<any> = {
  loginUser: loginReducer,
  user: userReducer,
  nodeBB: nodeBBReducer,
  mediaBook: mediaBookReducer,
  imageGallery: imageGalleryReducer,
  config: configReducer,
  pro: proReducer,
  reviews: proReviewReducer
};

export function init(startup: StartupService): any {
  return (): Promise<any> => startup.load();
}

const WP_LINK = `${environment.WP_LINK}`;
const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: environment.cookieDomain,
  },
  dismissOnScroll: true,
  dismissOnTimeout: true,
  position: 'bottom',
  theme: 'block',
  palette: {
    popup: {
      background: '#ffffff',
      text: '#333333',
      link: '#ffffff'
    },
    button: {
      background: '#3aa757',
      text: '#ffffff',
      border: 'transparent',
    }
  },
  type: 'opt-out',
  layout: 'my-custom-layout',
  layouts: {
    'my-custom-layout': '{{messagelink}}{{compliance}}'
  },
  elements: {
    messagelink: `
        <span style="display: flex;justify-content: space-around;align-items: center;" id="cookieconsent:desc" class="cc-message cookie-message">
        <p style="margin:0;"> {{header}} </p>
        <p class="cc-desc" style="margin:0;">{{message}} <a style="color: #3aa757;" aria-label="Cookie policy" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}" target="_blank">{{cookiePolicyLink}}</a>,
      <a style="color: #3aa757" aria-label="Privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}" target="_blank">{{privacyPolicyLink}}</a> and
      <a style="color: #3aa757" aria-label="Terms & Conditions" tabindex="2" class="cc-link" href="{{tacPolicyHref}}" target="_blank">{{tacPolicyLink}}</a></p>
    </span>
    
    `,
  },
  content: {
    message: 'We use cookies to improve your experience on our website. Read our updated',
    deny: '',
    header: 'COOKIES AND PRIVACY',
    href: 'https://cookiesandyou.com',
    policy: 'COOKIES AND PRIVACY',
    allow: '<a style="cursor:pointer;display: flex;align-items: center;justify-content: center;color: rgb(255, 255, 255);background-color: rgb(58, 167, 87);border-radius: 5px;width: 160px; height: 44px;line-height: 30px;font-family: Roboto; font-style: normal;font-weight: 500;font-size: 16px;" aria-label="allow cookies" role="button" tabindex="0" class="cc-btn cookieButton cc-allow">Accept</a>',
    cookiePolicyHref: WP_LINK + 'cookie-policy',
    cookiePolicyLink: 'Cookie Policy',
    privacyPolicyHref: WP_LINK + 'privacy-policy',
    privacyPolicyLink: 'Privacy Policy',
    tacPolicyHref: WP_LINK + 'privacy-policy',
    tacPolicyLink: 'Terms & Conditions'
  }
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'app-root'}),
    BrowserAnimationsModule,
    TransferHttpCacheModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    CreateMediaBookModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
    CookieModule.forRoot(),
    NgcCookieConsentModule.forRoot(cookieConfig),
    SignUpPopupModule,
    AlertModule,
    CompleteRegistrationModule,
    ThirdPartyCookiesModule
  ],
  providers: [
    CookieService,
    UniversalStorageService,
    CustomvalidationService,
    ProUserService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: APP_INITIALIZER, useFactory: init, multi: true, deps: [StartupService]}
    // provider used to create fake backend

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
