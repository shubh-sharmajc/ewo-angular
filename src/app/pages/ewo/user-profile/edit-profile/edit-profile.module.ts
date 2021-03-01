import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ScrollEventModule} from 'ngx-scroll-event';

import {EditProfileComponent} from './edit-profile.component';
import {UserService} from '../../../../_services/user/user.service';
import {AlertModule} from '../../../../modal/alert/alert.module';

const routes = [
  {path: '', component: EditProfileComponent}
];

@NgModule({
  declarations: [
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    ScrollEventModule,
    NgSelectModule,
    AlertModule
  ],
  exports: [EditProfileComponent],
  providers: [UserService]
})
export class EditProfileModule {
}
