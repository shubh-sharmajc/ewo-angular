import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';

import {CreateMediaBookComponent} from './create-media-book.component';
import {MediaBookService} from '../../../_services/media-book/media-book.service';

@NgModule({
  declarations: [
    CreateMediaBookComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CreateMediaBookComponent
  ],
  providers: [MediaBookService],
  entryComponents: [
    CreateMediaBookComponent
  ]
})
export class CreateMediaBookModule {
}
