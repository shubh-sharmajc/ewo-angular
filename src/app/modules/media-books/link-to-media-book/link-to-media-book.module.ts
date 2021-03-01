import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';

import {LinkToMediaBookComponent} from './link-to-media-book.component';
import {MediaBookService} from '../../../_services/media-book/media-book.service';
import {LinkToMediabookService} from './link-to-mediabook.service';
import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';

@NgModule({
  declarations: [
    LinkToMediaBookComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
  ],
  exports: [
    LinkToMediaBookComponent
  ],
  providers: [MediaBookService, MediaBookItemsService, LinkToMediabookService],
  entryComponents: [
    LinkToMediaBookComponent
  ]
})
export class LinkToMediaBookModule {
}
