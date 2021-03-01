import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';
import {ImageCropperModule} from 'ngx-image-cropper';
import {FormsModule} from '@angular/forms';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';

import {ChangeCoverPhotoComponent} from './change-cover-photo.component';
import {DragAndDropModule} from '../../_directives/drag-and-drop/drag-and-drop.module';
import {AlertModule} from '../alert/alert.module';
import {UploadImageService} from '../../_services/upload-image/upload-image.service';

@NgModule({
  declarations: [
    ChangeCoverPhotoComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ImageCropperModule,
    ProgressbarModule.forRoot(),
    DragAndDropModule,
    AlertModule,
    FormsModule
  ],
  exports: [
    ChangeCoverPhotoComponent
  ],
  providers: [UploadImageService],
  entryComponents: [
    ChangeCoverPhotoComponent
  ]
})
export class ChangeCoverPhotoModule {
}
