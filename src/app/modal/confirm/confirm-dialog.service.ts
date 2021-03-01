import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

import {ConfirmComponent} from './confirm.component';

@Injectable()
export class ConfirmDialogService {

  private confirmDialogRef: MatDialogRef<ConfirmComponent>;

  constructor(public dialog: MatDialog) {
  }

  public async confirm(title: any, message: any) {
    return new Promise((resolve, reject) => {
      if (!document.getElementsByClassName('delete-dialog').length) {
        this.confirmDialogRef = this.dialog.open(ConfirmComponent, {
          disableClose: true,
          height: '264px',
          width: '893px',
          panelClass: 'confirm-dialog',
          data: {title, message}
        });

        this.confirmDialogRef.afterClosed()
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
