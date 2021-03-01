import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LoginComponent} from './login.component';
import {AlertModule} from '../../modal/alert/alert.module';
import {ConfirmEmailModule} from '../../modal/confirm-email/confirm-email.module';

const routes = [
  {path: '', component: LoginComponent}
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    AlertModule,
    ConfirmEmailModule
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule {
}
