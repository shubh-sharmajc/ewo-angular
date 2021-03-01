import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SignUpPopupComponent} from './sign-up-popup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthServiceConfig, FacebookLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {MatDialogModule} from '@angular/material';

import {environment} from '../../../environments/environment';
import {UserService} from '../../_services/user/user.service';
import {SignUpDialogService} from './sign-up-dialog.service';
import {BasicAccountSetupModule} from '../basic-account-setup/basic-account-setup.module';
import {RegisteredEmailModule} from '../registered-email/registered-email.module';
import {IncompleteRegistrationModule} from '../incomplete-registration/incomplete-registration.module';

const socialConfig = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.FACEBOOK_CLIENT_ID)
  }
]);

export function socialProvideConfig() {
  return socialConfig;
}

@NgModule({
  declarations: [
    SignUpPopupComponent
  ],
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    SocialLoginModule,
    BasicAccountSetupModule,
    RegisteredEmailModule,
    IncompleteRegistrationModule
  ],
  exports: [
    SignUpPopupComponent
  ],
  providers: [
    {provide: AuthServiceConfig, useFactory: socialProvideConfig},
    SignUpDialogService,
    UserService
  ],
  entryComponents: [
    SignUpPopupComponent
  ]
})
export class SignUpPopupModule {
}
