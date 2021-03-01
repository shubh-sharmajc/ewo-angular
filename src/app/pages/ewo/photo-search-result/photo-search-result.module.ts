import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {InViewportModule} from 'ng-in-viewport';

import {PhotoSearchResultComponent} from './photo-search-result.component';
import {CheckLoginModule} from '../../../_directives/check-login-click/check-login.module';
import {ImageGalleryService} from '../../../_services/image-gallery/image-gallery.service';
import {SaveInMediabookModule} from '../../../modal/save-in-mediabook/save-in-mediabook.module';
import {ShareViaEmailDialogModule} from '../../../modal/share-via-email/share-via-email-dialog.module';

const routes = [
  {path: '', component: PhotoSearchResultComponent}
];

@NgModule({
  declarations: [
    PhotoSearchResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InViewportModule,
    CheckLoginModule,
    SaveInMediabookModule,
    ShareViaEmailDialogModule
  ],
  exports: [PhotoSearchResultComponent],
  providers: [ImageGalleryService]
})
export class PhotoSearchResultModule {
}
