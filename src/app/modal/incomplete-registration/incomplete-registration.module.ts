import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import {IncompleteRegistrationComponent} from './incomplete-registration.component';
import {IncompleteRegistrationDialogService} from './incomplete-registration-dialog.service';

@NgModule({
  declarations: [
    IncompleteRegistrationComponent
  ],
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    MatDialogModule
  ],
  exports: [
    IncompleteRegistrationComponent
  ],
  providers: [IncompleteRegistrationDialogService],
  entryComponents: [
    IncompleteRegistrationComponent
  ]
})
export class IncompleteRegistrationModule {
}
