import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';

import {ProUserViewProfileComponent} from './pro-user-view-profile.component';
import {MediaBookService} from '../../../../_services/media-book/media-book.service';
import {UserService} from '../../../../_services/user/user.service';

const routes = [
  {path: '', component: ProUserViewProfileComponent}
];

@NgModule({
  declarations: [ProUserViewProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTooltipModule
  ],
  exports: [ProUserViewProfileComponent],
  providers: [UserService, MediaBookService]
})
export class ProUserViewProfileModule {
}
