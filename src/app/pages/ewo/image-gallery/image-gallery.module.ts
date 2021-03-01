import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatDialogModule} from '@angular/material';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';

import {CheckLoginModule} from '../../../_directives/check-login-click/check-login.module';
import {DeleteDialogModule} from '../../../modal/delete/delete-dialog.module';
import {SaveInMediabookModule} from '../../../modal/save-in-mediabook/save-in-mediabook.module';
import {ShareViaEmailDialogModule} from '../../../modal/share-via-email/share-via-email-dialog.module';
import {RatingModule} from '../../../modules/rating/rating.module';

import {UserService} from '../../../_services/user/user.service';
import {ImageGalleryService} from '../../../_services/image-gallery/image-gallery.service';
import {ProReviewsService} from '../../../_services/pro-reviews/pro-reviews.service';

import {ImageGalleryComponent} from './image-gallery.component';
import {EditCommentComponent} from './edit-comment/edit-comment.component';

const routes = [
  {path: '', component: ImageGalleryComponent}
];

@NgModule({
  declarations: [
    ImageGalleryComponent,
    EditCommentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxHmCarouselModule,
    CheckLoginModule,
    DeleteDialogModule,
    ShareViaEmailDialogModule,
    SaveInMediabookModule,
    RatingModule
  ],
  exports: [ImageGalleryComponent],
  entryComponents: [EditCommentComponent],
  providers: [UserService, ImageGalleryService, ProReviewsService]
})
export class ImageGalleryModule {
}
