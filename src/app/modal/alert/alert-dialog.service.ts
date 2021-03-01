import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

import {AlertComponent} from './alert.component';

@Injectable()
export class AlertDialogService {
  private alertDialogRef: MatDialogRef<AlertComponent>;

  constructor(public dialog: MatDialog) {
  }

  public alert(message: any, height: any = '264px', width: any = '634px', heading?) {
    return new Promise((resolve, reject) => {
      if (!document.getElementsByClassName('alert-dialog').length) {
        this.alertDialogRef = this.dialog.open(AlertComponent, {
          height, width,
          disableClose: true,
          panelClass: 'alert-dialog',
          data: {message, heading}
        });
        this.alertDialogRef.afterClosed()
          .subscribe((res) => {
            if (res) {
              return resolve(res);
            } else {
              return reject({status: 'error'});
            }
          }, (e) => reject(e));
      }
    });
  }
}
