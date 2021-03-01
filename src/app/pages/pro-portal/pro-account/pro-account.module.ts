import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {AuthGuard} from '../../../_guards';
import {ProAccountComponent} from './pro-account.component';
import {ProUserInfoModule} from '../pro-user-info/pro-user-info.module';
import {LayoutModule} from '../../../modules/layout/layout.module';

const routes = [
  {
    path: '', component: ProAccountComponent, canActivate: [AuthGuard], data: {roles: ['pro-basic', 'pro-premium']},
    children: [
      {
        path: '',
        loadChildren: './pro-user-account/pro-user-account.module#ProUserAccountModule',
        canActivate: [AuthGuard],
        data: {roles: ['pro-basic', 'pro-premium']}
      },
      {
        path: ':tab',
        loadChildren: './pro-user-account/pro-user-account.module#ProUserAccountModule',
        canActivate: [AuthGuard],
        data: {roles: ['pro-basic', 'pro-premium']}
      },
      {path: '**', redirectTo: '/'}
    ]
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [ProAccountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProUserInfoModule,
    LayoutModule
  ],
  exports: [ProAccountComponent]
})
export class ProAccountModule {
}
