import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';

import {ThirdPartyCookiesComponent} from './third-party-cookies.component';
import {ThirdPartyCookiesDialogService} from './third-party-cookies-dialog.service';

@NgModule({
  declarations: [ThirdPartyCookiesComponent],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    ThirdPartyCookiesComponent
  ],
  providers: [
    ThirdPartyCookiesDialogService
  ],
  entryComponents: [
    ThirdPartyCookiesComponent
  ]
})
export class ThirdPartyCookiesModule {
}
