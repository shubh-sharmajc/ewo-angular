import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';

import {ProSignUpComponent} from './pro-sign-up.component';
import {ProUserInfoModule} from '../pro-user-info/pro-user-info.module';
import {ProUserService} from '../../../_services/pro-user/pro-user.service';
import {LayoutModule} from '../../../modules/layout/layout.module';
import {WarningReminderModule} from '../../../modal/pro-modal/warning-reminder/warning-reminder.module';

const routes = [{path: '', component: ProSignUpComponent}];

@NgModule({
  declarations: [ProSignUpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgIdleKeepaliveModule.forRoot(),
    ProUserInfoModule,
    LayoutModule,
    WarningReminderModule
  ],
  exports: [ProSignUpComponent],
  providers: [ProUserService]
})
export class ProSignUpModule {
}
