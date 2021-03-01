import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TabsModule} from 'ngx-bootstrap/tabs';

import {ProUserAccountComponent} from './pro-user-account.component';
import {ProUserInfoModule} from '../../pro-user-info/pro-user-info.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';

const routes = [{path: '', component: ProUserAccountComponent}];

@NgModule({
  declarations: [ProUserAccountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TabsModule.forRoot(),
    ProUserInfoModule,
    NgSelectModule,
    FormsModule
  ],
  exports: [ProUserAccountComponent]
})
export class ProUserAccountModule {
}
