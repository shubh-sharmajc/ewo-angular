import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ModalModule} from 'ngx-bootstrap/modal';

import {ContactUsService} from './contact-us.service';
import {ContactUsComponent} from './contact-us.component';

@NgModule({
  declarations: [
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  exports: [
    ContactUsComponent
  ],
  providers: [ContactUsService],
  entryComponents: [
    ContactUsComponent
  ]
})
export class ContactUsModule {
}
