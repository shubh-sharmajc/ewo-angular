import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {ContactUsComponent} from './contact-us.component';

@Injectable()
export class ContactUsService {

  private bsModalRef: BsModalRef;

  constructor(public dialog: MatDialog, private modalService: BsModalService) {
  }

  openContactUsModal() {
    this.bsModalRef = this.modalService.show(ContactUsComponent, {class: 'contact-us-modal'});
  }

}
