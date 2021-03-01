import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {PauseRegistrationComponent} from './pause-registration.component';

@Injectable()
export class PauseRegistrationService {

  private bsModalRef: BsModalRef;

  constructor(public dialog: MatDialog, private modalService: BsModalService) {
  }

  openPauseRegistrationModal() {
    return new Promise((resolve) => {
      this.bsModalRef = this.modalService.show(PauseRegistrationComponent, { class: 'gray modal-lg' });
      this.bsModalRef.content.onClose
        .subscribe((result) => {
          return resolve(result);
        });
    });

  }

}
