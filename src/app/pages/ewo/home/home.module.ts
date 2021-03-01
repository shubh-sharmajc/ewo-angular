import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InViewportModule} from 'ng-in-viewport';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import {AuthServiceConfig, FacebookLoginProvider, SocialLoginModule} from 'angularx-social-login';

import {environment} from '../../../../environments/environment';
import {CheckLoginModule} from '../../../_directives/check-login-click/check-login.module';
import {SignUpPopupModule} from '../../../modal/sign-up-popup/sign-up-popup.module';
import {AlertModule} from '../../../modal/alert/alert.module';
import {BasicAccountSetupModule} from '../../../modal/basic-account-setup/basic-account-setup.module';
import {RegisteredEmailModule} from '../../../modal/registered-email/registered-email.module';
import {IncompleteRegistrationModule} from '../../../modal/incomplete-registration/incomplete-registration.module';
import {ShareViaEmailDialogModule} from '../../../modal/share-via-email/share-via-email-dialog.module';
import {SaveInMediabookModule} from '../../../modal/save-in-mediabook/save-in-mediabook.module';

import {UserService} from '../../../_services/user/user.service';
import {ImageGalleryService} from '../../../_services/image-gallery/image-gallery.service';
import {ConfigurationService} from '../../../_services/configuration/configuration.service';

import {HomeComponent} from './home.component';

const socialConfig = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.FACEBOOK_CLIENT_ID)
  }
]);

export function socialProvideConfig() {
  return socialConfig;
}

const routes = [
  {path: '', component: HomeComponent}
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    InViewportModule,
    NgIdleKeepaliveModule.forRoot(),
    SocialLoginModule,
    CheckLoginModule,
    SignUpPopupModule,
    AlertModule,
    BasicAccountSetupModule,
    RegisteredEmailModule,
    IncompleteRegistrationModule,
    ShareViaEmailDialogModule,
    SaveInMediabookModule
  ],
  exports: [
    HomeComponent
  ],
  providers: [
    {provide: AuthServiceConfig, useFactory: socialProvideConfig},
    UserService,
    ImageGalleryService,
    ConfigurationService
  ]
})
export class HomeModule {
}
