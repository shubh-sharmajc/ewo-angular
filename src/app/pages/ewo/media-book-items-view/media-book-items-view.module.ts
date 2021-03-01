import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ScrollEventModule} from 'ngx-scroll-event';

import {MediaBookItemsViewComponent} from './media-book-items-view.component';
import {MediaBookService} from '../../../_services/media-book/media-book.service';
import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';

const routes = [
  {path: '', component: MediaBookItemsViewComponent}
];

@NgModule({
  declarations: [
    MediaBookItemsViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    ScrollEventModule,
    NgSelectModule
  ],
  exports: [MediaBookItemsViewComponent],
  providers: [MediaBookService, MediaBookItemsService]
})
export class MediaBookItemsViewModule {
}
