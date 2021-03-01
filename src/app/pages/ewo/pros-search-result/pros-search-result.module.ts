import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {NgxMaskModule} from 'ngx-mask';

import {ProsSearchResultComponent} from './pros-search-result.component';
import {ProUserService} from '../../../_services/pro-user/pro-user.service';
import {RatingModule} from '../../../modules/rating/rating.module';

const routes = [
  {path: '', component: ProsSearchResultComponent}
];

@NgModule({
  declarations: [ProsSearchResultComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RatingModule,
    NgxHmCarouselModule,
    NgxMaskModule.forRoot()
  ],
  exports: [ProsSearchResultComponent],
  providers: [ProUserService]
})
export class ProsSearchResultModule {
}
