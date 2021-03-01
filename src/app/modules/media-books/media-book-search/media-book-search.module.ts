import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ScrollEventModule} from 'ngx-scroll-event';

import {AlertModule} from '../../../modal/alert/alert.module';
import {DeleteDialogModule} from '../../../modal/delete/delete-dialog.module';
import {CreateMediaBookModule} from '../create-media-book/create-media-book.module';

import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';
import {MediaBookService} from '../../../_services/media-book/media-book.service';

import {MediaBookSearchComponent} from './media-book-search.component';

const routes = [
  {path: '', component: MediaBookSearchComponent}
];


@NgModule({
  declarations: [
    MediaBookSearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollEventModule,
    NgSelectModule,
    AlertModule,
    DeleteDialogModule,
    CreateMediaBookModule
  ],
  exports: [
    MediaBookSearchComponent
  ],
  entryComponents: [],
  providers: [MediaBookService, MediaBookItemsService]
})
export class MediaBookSearchModule {
}
