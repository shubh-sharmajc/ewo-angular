import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';

import {ConfirmComponent} from './confirm.component';
import {ConfirmDialogService} from './confirm-dialog.service';

@NgModule({
  declarations: [ConfirmComponent],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    ConfirmComponent
  ],
  providers: [
    ConfirmDialogService
  ],
  entryComponents: [
    ConfirmComponent
  ]
})
export class ConfirmModule {
}
