import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';

import {BasicAccountSetupComponent} from './basic-account-setup.component';
import {BasicAccountSetupDialogService} from './basic-account-setup-dialog.service';
import {ConfirmEmailModule} from '../confirm-email/confirm-email.module';

@NgModule({
  declarations: [
    BasicAccountSetupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    ConfirmEmailModule
  ],
  exports: [
    BasicAccountSetupComponent
  ],
  providers: [
    BasicAccountSetupDialogService
  ],
  entryComponents: [
    BasicAccountSetupComponent
  ]
})
export class BasicAccountSetupModule {
}
