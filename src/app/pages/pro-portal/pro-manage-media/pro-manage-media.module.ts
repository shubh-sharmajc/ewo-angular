import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProManageMediaComponent} from './pro-manage-media.component';
import {AuthGuard} from '../../../_guards';
import {RouterModule} from '@angular/router';
import {LayoutModule} from '../../../modules/layout/layout.module';
import {ALL_USER_ROLES, PRO_USER_ROLES} from '../../../constant';

const routes = [
  {
    path: ':username',
    component: ProManageMediaComponent,
    canActivate: [AuthGuard],
    data: {roles: ALL_USER_ROLES},
    children: [
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
        data: {roles: PRO_USER_ROLES}
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
        data: {roles: PRO_USER_ROLES}
      },
      {
        path: 'mediabooks/:id/mb-sequence',
        loadChildren: '../../../modules/media-books/media-book-items/media-book-items.module#MediaBookItemsModule',
        canActivate: [AuthGuard],
        data: {roles: PRO_USER_ROLES}
      },
      {path: '**', redirectTo: '/'}
    ]
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [ProManageMediaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule
  ],
  exports: [ProManageMediaComponent]
})
export class ProManageMediaModule {
}
