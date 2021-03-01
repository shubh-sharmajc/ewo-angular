import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {WarningReminderComponent} from './warning-reminder.component';

@Injectable()
export class WarningReminderService {

  private bsModalRef: BsModalRef;

  constructor(public dialog: MatDialog, private modalService: BsModalService) {
  }

  openWarningReminderModal() {
    return new Promise((resolve, reject) => {
      this.bsModalRef = this.modalService.show(WarningReminderComponent, {class: 'gray modal-lg warning-system-timeout'});
      this.bsModalRef.content.onClose
        .subscribe((result) => {
          if (result) {
            return resolve(result);
          } else {
            return reject(result);
          }
        });
    });
  }

}
