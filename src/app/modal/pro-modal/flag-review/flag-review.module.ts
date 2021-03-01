import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {ModalModule} from 'ngx-bootstrap/modal';

import {FlagReviewService} from './flag-review.service';
import {FlagReviewComponent} from './flag-review.component';

@NgModule({
  declarations: [
    FlagReviewComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  exports: [
    FlagReviewComponent
  ],
  providers: [FlagReviewService],
  entryComponents: [
    FlagReviewComponent
  ]
})
export class FlagReviewModule {
}
