import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';

import {AuthGuard, NotAuthGuard} from '../../_guards';
import {ProPortalComponent} from './pro-portal.component';
import {LayoutModule} from '../../modules/layout/layout.module';

const routes = [
  {
    path: '', component: ProPortalComponent,
    children: [
      {path: 'sign-up', loadChildren: './pro-sign-up/pro-sign-up.module#ProSignUpModule', canActivate: [NotAuthGuard]},
      {
        path: 'resume-registration',
        loadChildren: './pro-sign-up/pro-sign-up.module#ProSignUpModule',
        canActivate: [AuthGuard],
        data: {roles: ['pro-basic', 'pro-premium']}
      },
      {path: 'user', loadChildren: './pro-user-profile/pro-user-profile.module#ProUserProfileModule'},
      {path: 'account', loadChildren: './pro-account/pro-account.module#ProAccountModule'},
      {path: 'manage-media', loadChildren: './pro-manage-media/pro-manage-media.module#ProManageMediaModule'},
      {path: 'resources', loadChildren: './pro-resources/pro-resources.module#ProResourcesModule'},
      {path: 'verify-email', loadChildren: './pro-sign-up/pro-sign-up.module#ProSignUpModule'},
      // {path: '', loadChildren: './pro-home/pro-home.module#ProHomeModule'},
      {path: '**', redirectTo: '/'}
    ]
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    ProPortalComponent
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
export class ProPortalModule {
}
