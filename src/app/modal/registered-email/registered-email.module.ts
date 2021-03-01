import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import {RegisteredEmailComponent} from './registered-email.component';
import {RegisteredEmailDialogService} from './registered-email-dialog.service';

@NgModule({
  declarations: [
    RegisteredEmailComponent
  ],
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    MatDialogModule
  ],
  exports: [
    RegisteredEmailComponent
  ],
  providers: [
    RegisteredEmailDialogService
  ],
  entryComponents: [
    RegisteredEmailComponent
  ]
})
export class RegisteredEmailModule {
}
