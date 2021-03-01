import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';

import {AlertComponent} from './alert.component';
import {AlertDialogService} from './alert-dialog.service';

@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  exports: [
    AlertComponent
  ],
  providers: [
    AlertDialogService
  ],
  entryComponents: [
    AlertComponent
  ]
})
export class AlertModule {
}
