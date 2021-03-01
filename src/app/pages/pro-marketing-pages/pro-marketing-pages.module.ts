import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {LayoutModule} from '../../modules/layout/layout.module';
import {ProMarketingPagesComponent} from './pro-marketing-pages.component';
import {ProPricingComponent} from './pages/pro-pricing/pro-pricing.component';
import {ConfigurationService} from '../../_services/configuration/configuration.service';
import {ConfirmModule} from '../../modal/confirm/confirm.module';
import {AccountDowngradeModule} from '../../modal/pro-modal/account-downgrade/account-downgrade.module';

const routes = [
  {
    path: '', component: ProMarketingPagesComponent,
    children: [
      {path: '', redirectTo: 'solutions'},
      {path: 'solutions', loadChildren: './pages/pro-marketing-solutions/pro-marketing-solutions.module#ProMarketingSolutionsModule'},
      {path: 'pro-categories', loadChildren: './pages/pro-categories/pro-categories.module#ProCategoriesModule'},
      {path: 'how-it-works', loadChildren: './pages/pro-how-it-works/pro-how-it-works.module#ProHowItWorksModule'},
      {path: 'pro-pricing', component: ProPricingComponent}
    ],
  },
  {path: '**', redirectTo: 'solutions'}
];

@NgModule({
  declarations: [ProMarketingPagesComponent, ProPricingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    FormsModule,
    ConfirmModule,
    AccountDowngradeModule
  ],
  providers: [ConfigurationService]
})
export class ProMarketingPagesModule {
}
