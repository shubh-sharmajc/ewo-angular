import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ScrollEventModule} from 'ngx-scroll-event';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {DeleteDialogModule} from '../../../modal/delete/delete-dialog.module';
import {ShareViaEmailDialogModule} from '../../../modal/share-via-email/share-via-email-dialog.module';
import {CreateMediaBookModule} from '../create-media-book/create-media-book.module';

import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';
import {MediaBookService} from '../../../_services/media-book/media-book.service';
import {UserService} from '../../../_services/user/user.service';

import {MediaBookItemsComponent} from './media-book-items.component';
import {ShareMediaBookComponent} from '../share-media-book/share-media-book.component';
import {CopyToMediabookComponent} from '../copy-to-mediabook/copy-to-mediabook.component';
import {ShareMediaBookItemComponent} from '../share-media-book-item/share-media-book-item.component';
import {LinkToMediabookService} from '../link-to-media-book/link-to-mediabook.service';
import {LinkToMediaBookModule} from '../link-to-media-book/link-to-media-book.module';

const routes = [
  {path: '', component: MediaBookItemsComponent}
];

@NgModule({
  declarations: [
    MediaBookItemsComponent,
    CopyToMediabookComponent,
    ShareMediaBookComponent,
    ShareMediaBookItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollEventModule,
    NgSelectModule,
    NgxHmCarouselModule,
    DeleteDialogModule,
    LinkToMediaBookModule,
    ShareViaEmailDialogModule,
    CreateMediaBookModule,
    DragDropModule
  ],
  exports: [
    MediaBookItemsComponent,
    CopyToMediabookComponent,
    ShareMediaBookComponent,
    ShareMediaBookItemComponent
  ],
  entryComponents: [
    CopyToMediabookComponent,
    ShareMediaBookComponent,
    ShareMediaBookItemComponent
  ],
  providers: [
    MediaBookService,
    MediaBookItemsService,
    UserService,
    LinkToMediabookService
  ]
})
export class MediaBookItemsModule {
}
