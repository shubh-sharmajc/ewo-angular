import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';
import {ImageCropperModule} from 'ngx-image-cropper';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';

import {ProfileImageCropComponent} from './profile-image-crop.component';
import {UploadImageService} from '../../_services/upload-image/upload-image.service';
import {AlertModule} from '../alert/alert.module';

@NgModule({
  declarations: [
    ProfileImageCropComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ImageCropperModule,
    ProgressbarModule.forRoot(),
    AlertModule
  ],
  exports: [
    ProfileImageCropComponent
  ],
  providers: [UploadImageService],
  entryComponents: [
    ProfileImageCropComponent
  ]
})
export class ProfileImageCropModule {
}
