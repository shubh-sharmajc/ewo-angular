import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {UsersSearchResultComponent} from './users-search-result.component';

const routes = [
  {path: '', component: UsersSearchResultComponent}
];

@NgModule({
  declarations: [UsersSearchResultComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [UsersSearchResultComponent]
})
export class UsersSearchResultModule {
}
