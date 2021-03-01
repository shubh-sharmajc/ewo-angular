import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {RegistrationReminderComponent} from './registration-reminder.component';

@Injectable()
export class RegistrationReminderService {

  private bsModalRef: BsModalRef;

  constructor(public dialog: MatDialog, private modalService: BsModalService) {
  }

  openRegistrationReminderModal() {
    return new Promise((resolve) => {
      this.bsModalRef = this.modalService.show(RegistrationReminderComponent, Object.assign({}, { class: 'gray modal-lg' }));
      this.bsModalRef.content.onClose
        .subscribe((result) => {
          return resolve(result);
        });
    });

  }

}
