import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ScrollEventModule} from 'ngx-scroll-event';

import {ViewProfileComponent} from './view-profile.component';
import {UserService} from '../../../../_services/user/user.service';
import {MediaBookService} from '../../../../_services/media-book/media-book.service';
import {ShortNumberPipeModule} from '../../../../_pipes/short-number-pipe.module';

const routes = [
  {path: '', component: ViewProfileComponent}
];

@NgModule({
  declarations: [
    ViewProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    ScrollEventModule,
    NgSelectModule,
    ShortNumberPipeModule
  ],
  exports: [ViewProfileComponent],
  providers: [UserService, MediaBookService]
})
export class ViewProfileModule {
}
