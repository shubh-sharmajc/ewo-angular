import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {UserProfileComponent} from './user-profile.component';
import {AuthGuard} from '../../../_guards/index';
import {UserService} from '../../../_services/user/user.service';
import {ProfileImageCropModule} from '../../../modal/profile-image-crop/profile-image-crop.module';
import {ChangeCoverPhotoModule} from '../../../modal/change-cover-photo/change-cover-photo.module';
import {ImageExistsPipeModule} from '../../../_pipes/image-exists.pipe.module';
import {ALL_USER_ROLES, USER_ROLES} from '../../../constant';

const routes = [
  {
    path: ':username', component: UserProfileComponent, canActivate: [AuthGuard],
    data: {roles: ALL_USER_ROLES},
    children: [
      {
        path: '',
        loadChildren: './view-profile/view-profile.module#ViewProfileModule',
        canActivate: [AuthGuard],
        data: {roles: ALL_USER_ROLES}
      },
      {
        path: 'edit-profile',
        loadChildren: './edit-profile/edit-profile.module#EditProfileModule',
        canActivate: [AuthGuard],
        data: {roles: USER_ROLES}
      },
      {
        path: 'mediabooks',
        loadChildren: '../../../modules/media-books/media-books.module#MediaBooksModule',
        canActivate: [AuthGuard],
        data: {roles: ALL_USER_ROLES}
      },
      {
        path: 'mediabooks/search',
        loadChildren: '../../../modules/media-books/media-book-search/media-book-search.module#MediaBookSearchModule',
        canActivate: [AuthGuard],
        data: {roles: USER_ROLES}
      },
      {
        path: 'mediabooks/:id/items',
        loadChildren: '../../../modules/media-books/media-book-items/media-book-items.module#MediaBookItemsModule',
        canActivate: [AuthGuard],
        data: {roles: ALL_USER_ROLES}
      },
      {
        path: 'mediabooks/:id/upload',
        loadChildren: '../../../modules/media-books/upload-mb-items/upload-mb-items.module#UploadMbItemsModule',
        canActivate: [AuthGuard],
        data: {roles: USER_ROLES}
      },
      {
        path: 'mediabooks/:id/mb-sequence',
        loadChildren: '../../../modules/media-books/media-book-items/media-book-items.module#MediaBookItemsModule',
        canActivate: [AuthGuard],
        data: {roles: USER_ROLES}
      },
      {
        path: 'my-reviews',
        loadChildren: './my-reviews/my-reviews.module#MyReviewsModule',
        canActivate: [AuthGuard],
        data: {roles: USER_ROLES}
      },
      {path: '**', redirectTo: '/'}
    ]
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProfileImageCropModule,
    ChangeCoverPhotoModule,
    ImageExistsPipeModule
  ],
  exports: [UserProfileComponent],
  providers: [UserService]
})
export class UserProfileModule {
}
