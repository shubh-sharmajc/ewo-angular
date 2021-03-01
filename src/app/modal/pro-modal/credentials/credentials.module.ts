import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CollapseModule} from 'ngx-bootstrap/collapse';

import {CredentialsComponent} from './credentials.component';
import {CredentialsService} from './credentials.service';

@NgModule({
  declarations: [CredentialsComponent],
  imports: [
    CommonModule,
    CollapseModule.forRoot()
  ],
  exports: [CredentialsComponent],
  providers: [CredentialsService],
  entryComponents: [CredentialsComponent]
})
export class CredentialsModule {
}
