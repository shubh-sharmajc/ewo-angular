import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NotAuthGuard} from '../../_guards/index';
import {ForgotPasswordComponent} from './forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {UserService} from '../../_services/user/user.service';
import {AlertModule} from '../../modal/alert/alert.module';

const routes = [
  {path: 'forgot', component: ForgotPasswordComponent, canActivate: [NotAuthGuard]},
  {path: 'reset/:token', component: ResetPasswordComponent, canActivate: [NotAuthGuard]}
];

@NgModule({
  declarations: [ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    AlertModule
  ],
  exports: [
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  providers: [UserService]
})
export class ForgotPasswordModule {
}
