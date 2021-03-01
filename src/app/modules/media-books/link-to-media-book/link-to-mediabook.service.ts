import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {LinkToMediaBookComponent} from './link-to-media-book.component';


@Injectable()
export class LinkToMediabookService {
  private bsModalRef: BsModalRef;

  constructor(public dialog: MatDialog, private modalService: BsModalService) {
  }

  openLinkToMediabookModal(mediaBookId, mbItemId) {
    return new Promise((resolve, reject) => {
      this.bsModalRef = this.modalService.show(LinkToMediaBookComponent, {
        class: 'modal-lg link-to-media-book-modal',
        initialState: {mediaBookId, mbItemId}
      });
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
