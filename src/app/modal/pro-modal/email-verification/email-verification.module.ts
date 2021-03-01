import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ModalModule} from 'ngx-bootstrap/modal';
import {RouterModule} from '@angular/router';

import {EmailVerificationService} from './email-verification.service';
import {EmailVerificationComponent} from './email-verification.component';

@NgModule({
  declarations: [
    EmailVerificationComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild([])
  ],
  exports: [
    EmailVerificationComponent
  ],
  providers: [EmailVerificationService],
  entryComponents: [
    EmailVerificationComponent
  ]
})
export class EmailVerificationModule {
}
