import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

import {ProUserProfileComponent} from './pro-user-profile.component';
import {AuthGuard} from '../../../_guards';
import {ProfileImageCropModule} from '../../../modal/profile-image-crop/profile-image-crop.module';
import {ChangeCoverPhotoModule} from '../../../modal/change-cover-photo/change-cover-photo.module';
import {WriteAReviewModule} from '../../../modal/pro-modal/write-a-review/write-a-review.module';
import {ContactUsModule} from '../../../modal/pro-modal/contact-us/contact-us.module';
import {ShortNumberPipeModule} from '../../../_pipes/short-number-pipe.module';
import {ImageExistsPipeModule} from '../../../_pipes/image-exists.pipe.module';
import {ALL_USER_ROLES} from '../../../constant';
import {SaveInMediabookModule} from '../../../modal/save-in-mediabook/save-in-mediabook.module';
import {RatingModule} from '../../../modules/rating/rating.module';

const routes = [
  {
    path: ':username', component: ProUserProfileComponent, canActivate: [AuthGuard],
    data: {roles: ALL_USER_ROLES},
    children: [
      {
        path: '',
        loadChildren: './pro-user-view-profile/pro-user-view-profile.module#ProUserViewProfileModule',
        canActivate: [AuthGuard],
        data: {roles: ALL_USER_ROLES}
      },
      {
        path: 'review',
        loadChildren: './pro-user-review-profile/pro-user-review-profile.module#ProUserReviewProfileModule',
        canActivate: [AuthGuard],
        data: {roles: ALL_USER_ROLES}
      },
      {
        path: 'mediabooks',
        loadChildren: '../../../modules/media-books/media-books.module#MediaBooksModule',
        canActivate: [AuthGuard],
        data: {roles: ALL_USER_ROLES}
      },
      {
        path: 'mediabooks/:id/items',
        loadChildren: '../../../modules/media-books/media-book-items/media-book-items.module#MediaBookItemsModule',
        canActivate: [AuthGuard],
        data: {roles: ALL_USER_ROLES}
      },
      {path: '**', redirectTo: '/'}
    ]
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [ProUserProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxMaskModule.forRoot(),
    ProfileImageCropModule,
    ChangeCoverPhotoModule,
    WriteAReviewModule,
    ContactUsModule,
    ShortNumberPipeModule,
    RatingModule,
    ImageExistsPipeModule,
    SaveInMediabookModule
  ],
  exports: [ProUserProfileComponent]
})
export class ProUserProfileModule {
}
