import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {BsModalService, ModalModule} from 'ngx-bootstrap/modal';

import {PauseRegistrationService} from './pause-registration.service';
import {PauseRegistrationComponent} from './pause-registration.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    PauseRegistrationComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ModalModule.forRoot()
  ],
  exports: [
    PauseRegistrationComponent
  ],
  providers: [PauseRegistrationService],
  entryComponents: [
    PauseRegistrationComponent
  ]
})
export class PauseRegistrationModule {
}
