import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';

import {AuthGuard, NotAuthGuard} from '../../_guards';
import {EWOComponent} from './ewo.component';
import {LayoutModule} from '../../modules/layout/layout.module';
import {ALL_USER_ROLES} from '../../constant';

const routes = [
  {
    path: '', component: EWOComponent,
    children: [
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {path: 'signin', loadChildren: '../../modules/login/login.module#LoginModule', canActivate: [NotAuthGuard]},
      {
        path: 'password',
        loadChildren: '../../modules/forgot-password/forgot-password.module#ForgotPasswordModule',
        canActivate: [NotAuthGuard]
      },
      {path: 'signup', loadChildren: './home/home.module#HomeModule', canActivate: [NotAuthGuard]},
      {path: 'photos', loadChildren: './photo-search-result/photo-search-result.module#PhotoSearchResultModule'},
      {path: 'image-gallery/:id', loadChildren: './image-gallery/image-gallery.module#ImageGalleryModule'},
      {path: 'mediabook/slideshow/:id', loadChildren: './image-gallery/image-gallery.module#ImageGalleryModule'},
      {path: 'story/slideshow/:story_url', loadChildren: './image-gallery/image-gallery.module#ImageGalleryModule'},
      {path: 'verify-email', loadChildren: './verify-email/verify-email.module#VerifyEmailModule'},
      {path: 'explore-features', loadChildren: './marketing/marketing.module#MarketingModule', canActivate: [NotAuthGuard]},
      {path: 'shared/mediabooks/:id/view', loadChildren: './media-book-items-view/media-book-items-view.module#MediaBookItemsViewModule'},
      {
        path: 'users',
        loadChildren: './users-search-result/users-search-result.module#UsersSearchResultModule',
        canActivate: [AuthGuard],
        data: {roles: ALL_USER_ROLES}
      },
      {
        path: 'pros-search',
        loadChildren: './pros-search-result/pros-search-result.module#ProsSearchResultModule',
        canActivate: [AuthGuard],
        data: {roles: ALL_USER_ROLES}
      },
      {path: 'user', loadChildren: './user-profile/user-profile.module#UserProfileModule'},
      {path: 'find-pros', loadChildren: './find-pros/find-pros.module#FindProsModule'},
      {path: '', loadChildren: './home/home.module#HomeModule'},
      {path: '**', redirectTo: '/', pathMatch: 'full'}
    ]
  },
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    EWOComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    LayoutModule
  ]
})
export class EWOModule {
}
