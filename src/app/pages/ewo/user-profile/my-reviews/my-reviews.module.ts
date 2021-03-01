import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ScrollEventModule} from 'ngx-scroll-event';

import {WriteAReviewModule} from '../../../../modal/pro-modal/write-a-review/write-a-review.module';
import {FlagReviewModule} from '../../../../modal/pro-modal/flag-review/flag-review.module';
import {RatingModule} from '../../../../modules/rating/rating.module';
import {MyReviewsComponent} from './my-reviews.component';

const routes = [{path: '', component: MyReviewsComponent}];

@NgModule({
  declarations: [MyReviewsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RatingModule,
    FormsModule,
    ScrollEventModule,
    FlagReviewModule,
    WriteAReviewModule
  ],
  exports: [MyReviewsComponent],
})
export class MyReviewsModule {
}
