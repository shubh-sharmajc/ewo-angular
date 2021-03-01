import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import {ConfirmEmailComponent} from './confirm-email.component';
import {VerifyEmailService} from '../../_services/verify-email/verify-email.service';
import {AlertModule} from '../alert/alert.module';

@NgModule({
  declarations: [
    ConfirmEmailComponent
  ],
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    MatDialogModule,
    AlertModule
  ],
  exports: [
    ConfirmEmailComponent
  ],
  providers: [
    VerifyEmailService
  ],
  entryComponents: [
    ConfirmEmailComponent
  ]
})
export class ConfirmEmailModule {
}
