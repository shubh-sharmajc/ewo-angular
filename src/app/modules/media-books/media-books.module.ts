import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ScrollEventModule} from 'ngx-scroll-event';

import {AlertModule} from '../../modal/alert/alert.module';
import {DeleteDialogModule} from '../../modal/delete/delete-dialog.module';
import {CreateMediaBookModule} from './create-media-book/create-media-book.module';

import {MediaBookService} from '../../_services/media-book/media-book.service';
import {UserService} from '../../_services/user/user.service';

import {MediaBooksComponent} from './media-books.component';

const routes = [
  {path: '', component: MediaBooksComponent}
];

@NgModule({
  declarations: [
    MediaBooksComponent
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
    MediaBooksComponent
  ],
  entryComponents: [],
  providers: [MediaBookService, UserService]
})
export class MediaBooksModule {
}
