import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProListingComponent } from './pro-listing.component';
import { RouterModule } from '@angular/router';
import {RegistrationReminderModule} from '../../../../modal/pro-modal/registration-reminder/registration-reminder.module';

@NgModule({
  declarations: [ProListingComponent],
  imports: [
    CommonModule,
    RouterModule,
    RegistrationReminderModule
  ],
  exports:[
    ProListingComponent
  ]
})
export class ProListingModule { }
