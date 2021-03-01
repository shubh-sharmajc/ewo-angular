import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';

import {UploadMbItemsComponent} from './upload-mb-items.component';
import {UploadImageService} from '../../../_services/upload-image/upload-image.service';
import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';
import {DragAndDropModule} from '../../../_directives/drag-and-drop/drag-and-drop.module';

const routes = [
  {path: '', component: UploadMbItemsComponent}
];

@NgModule({
  declarations: [UploadMbItemsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProgressbarModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    DragAndDropModule
  ],
  exports: [UploadMbItemsComponent],
  providers: [
    MediaBookItemsService,
    UploadImageService
  ]
})
export class UploadMbItemsModule {
}
