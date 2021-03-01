import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha';
import {RouterModule} from '@angular/router';
import {NgxMaskModule} from 'ngx-mask';
import {NgSelectModule} from '@ng-select/ng-select';

import {environment} from '../../../../environments/environment';
import {PauseRegistrationModule} from '../../../modal/pro-modal/pause-registration/pause-registration.module';
import {EmailVerificationModule} from '../../../modal/pro-modal/email-verification/email-verification.module';
import {CredentialsModule} from '../../../modal/pro-modal/credentials/credentials.module';

import {BusinessService} from '../../../_services/business/business.service';

import {BasicRegistrationComponent} from './basic-registration/basic-registration.component';
import {BusinessProfileComponent} from './business-profile/business-profile.component';
import {RatingsAndReviewsComponent} from './ratings-and-reviews/ratings-and-reviews.component';
import {SocialMediaComponent} from './social-media/social-media.component';
import {FinalizeProfileComponent} from './finalize-profile/finalize-profile.component';
import {TestimonialsComponent} from './testimonials/testimonials.component';
import {RecognitionsComponent} from './recognitions/recognitions.component';
import {StaffBiasComponent} from './staff-bias/staff-bias.component';
import {AddLocationsComponent} from './add-locations/add-locations.component';
import {AccountSecurityComponent} from './account-security/account-security.component';
import {AccountHomeComponent} from './account-home/account-home.component';
import {BillingAndPaymentsComponent} from './billing-and-payments/billing-and-payments.component';
import {ConfigurationService} from '../../../_services/configuration/configuration.service';

@NgModule({
  declarations: [
    BasicRegistrationComponent,
    BusinessProfileComponent,
    RatingsAndReviewsComponent,
    SocialMediaComponent,
    FinalizeProfileComponent,
    TestimonialsComponent,
    RecognitionsComponent,
    StaffBiasComponent,
    AddLocationsComponent,
    AccountHomeComponent,
    BillingAndPaymentsComponent,
    AccountSecurityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    NgxMaskModule.forRoot(),
    TypeaheadModule.forRoot(),
    RecaptchaModule,
    RecaptchaFormsModule,
    PauseRegistrationModule,
    EmailVerificationModule,
    CredentialsModule,
    RouterModule,
    NgSelectModule
  ],
  exports: [
    BasicRegistrationComponent,
    BusinessProfileComponent,
    RatingsAndReviewsComponent,
    SocialMediaComponent,
    FinalizeProfileComponent,
    TestimonialsComponent,
    RecognitionsComponent,
    StaffBiasComponent,
    AddLocationsComponent,
    AccountHomeComponent,
    BillingAndPaymentsComponent,
    AccountSecurityComponent
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {siteKey: environment.GOOGLE_reCAPTCHA_KEY} as RecaptchaSettings,
    },
    BusinessService, ConfigurationService
  ],
  entryComponents: []
})
export class ProUserInfoModule {
}
