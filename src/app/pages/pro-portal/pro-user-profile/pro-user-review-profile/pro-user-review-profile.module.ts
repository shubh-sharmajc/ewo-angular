import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ScrollEventModule} from 'ngx-scroll-event';

import {ProUserReviewProfileComponent} from './pro-user-review-profile.component';
import {BusinessService} from '../../../../_services/business/business.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlagReviewModule} from '../../../../modal/pro-modal/flag-review/flag-review.module';
import {RatingModule} from '../../../../modules/rating/rating.module';

const routes = [
  {path: '', component: ProUserReviewProfileComponent}
];

@NgModule({
  declarations: [ProUserReviewProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ScrollEventModule,
    FlagReviewModule,
    ReactiveFormsModule,
    RatingModule
  ],
  exports: [ProUserReviewProfileComponent],
  providers: [BusinessService]
})
export class ProUserReviewProfileModule {
}
