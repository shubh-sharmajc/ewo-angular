import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';

import {SaveInMediabookComponent} from './save-in-mediabook.component';
import {SaveInMediabookDialogService} from './save-in-mediabook-dialog.service';
import {MediaBookService} from '../../_services/media-book/media-book.service';
import {AlertModule} from '../alert/alert.module';
import {MediaBookItemsService} from '../../_services/media-book-items/media-book-items.service';

@NgModule({
  declarations: [
    SaveInMediabookComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule,
    NgSelectModule
  ],
  exports: [
    SaveInMediabookComponent
  ],
  providers: [
    SaveInMediabookDialogService,
    MediaBookService,
    MediaBookItemsService
  ],
  entryComponents: [
    SaveInMediabookComponent
  ]
})
export class SaveInMediabookModule {
}
