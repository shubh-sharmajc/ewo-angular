import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {ProHeaderComponent} from './pro-header/pro-header.component';
import {AccountBannerComponent} from './account-banner/account-banner.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ProHeaderComponent,
    AccountBannerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([]),
    NgxMaskModule.forRoot()
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ProHeaderComponent,
    AccountBannerComponent
  ]
})
export class LayoutModule {
}
