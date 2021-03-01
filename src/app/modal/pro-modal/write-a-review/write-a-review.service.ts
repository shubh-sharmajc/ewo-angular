import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {WriteAReviewComponent} from './write-a-review.component';

@Injectable()
export class WriteAReviewService {

  private bsModalRef: BsModalRef;

  constructor(public dialog: MatDialog, private modalService: BsModalService) {
  }

  openWriteAReviewModal(review?) {
    return new Promise((resolve, reject) => {
      this.bsModalRef = this.modalService.show(WriteAReviewComponent, {class: 'write-review-modal',
        initialState: {review: review}});
      this.bsModalRef.content.onClose.subscribe((result: any) => {
        if (result) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    });
  }

}
