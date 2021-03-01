import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ModalModule} from 'ngx-bootstrap/modal';
import {RatingModule} from 'ngx-bootstrap/rating';

import {WriteAReviewService} from './write-a-review.service';
import {WriteAReviewComponent} from './write-a-review.component';
import {ProReviewsService} from '../../../_services/pro-reviews/pro-reviews.service';

@NgModule({
  declarations: [
    WriteAReviewComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    RatingModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [
    WriteAReviewComponent
  ],
  providers: [WriteAReviewService, ProReviewsService],
  entryComponents: [
    WriteAReviewComponent
  ]
})
export class WriteAReviewModule {
}
