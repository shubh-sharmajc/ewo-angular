import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {EmailVerificationComponent} from './email-verification.component';

@Injectable()
export class EmailVerificationService {

  private bsModalRef: BsModalRef;

  constructor(public dialog: MatDialog, private modalService: BsModalService) {
  }

  openEmailVerificationModal(initialState: any) {
    if (!document.getElementsByClassName('email-verification-modal').length) {
      this.bsModalRef = this.modalService.show(EmailVerificationComponent, {initialState, class: 'email-verification-modal gray modal-lg'});
    }
  }

}
