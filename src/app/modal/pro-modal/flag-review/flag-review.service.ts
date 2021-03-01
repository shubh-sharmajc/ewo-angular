import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {FlagReviewComponent} from './flag-review.component';

@Injectable()
export class FlagReviewService {

  private bsModalRef: BsModalRef;

  constructor(public dialog: MatDialog, private modalService: BsModalService) {
  }

  openFlagReviewModal(reviewID?, commentID?) {
    this.bsModalRef = this.modalService.show(FlagReviewComponent, {
      class: 'flag-review-modal',
      initialState: {reviewID: reviewID, commentID: commentID}
    });
  }

}
