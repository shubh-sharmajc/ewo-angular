import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MarketingComponent} from './marketing.component';
import {ConfigurationService} from '../../../_services/configuration/configuration.service';
import {SignUpPopupModule} from '../../../modal/sign-up-popup/sign-up-popup.module';

const routes = [
  {path: '', component: MarketingComponent}
];

@NgModule({
  declarations: [MarketingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SignUpPopupModule
  ],
  exports: [MarketingComponent],
  providers: [ConfigurationService]
})
export class MarketingModule {
}
