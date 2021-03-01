import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ModalModule} from 'ngx-bootstrap/modal';

import {WarningReminderService} from './warning-reminder.service';
import {WarningReminderComponent} from './warning-reminder.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    WarningReminderComponent
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
    WarningReminderComponent
  ],
  providers: [WarningReminderService],
  entryComponents: [
    WarningReminderComponent
  ]
})
export class WarningReminderModule {
}
