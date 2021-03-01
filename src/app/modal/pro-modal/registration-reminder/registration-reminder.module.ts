import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ModalModule} from 'ngx-bootstrap/modal';

import {RegistrationReminderService} from './registration-reminder.service';
import {RegistrationReminderComponent} from './registration-reminder.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    RegistrationReminderComponent
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
    RegistrationReminderComponent
  ],
  providers: [RegistrationReminderService],
  entryComponents: [
    RegistrationReminderComponent
  ]
})
export class RegistrationReminderModule {
}
