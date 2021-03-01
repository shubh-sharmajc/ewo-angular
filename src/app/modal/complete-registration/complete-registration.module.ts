import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import {CompleteRegistrationComponent} from './complete-registration.component';

@NgModule({
  declarations: [
    CompleteRegistrationComponent
  ],
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    MatDialogModule,
  ],
  exports: [
    CompleteRegistrationComponent
  ],
  providers: [],
  entryComponents: [
    CompleteRegistrationComponent
  ]
})
export class CompleteRegistrationModule {
}
