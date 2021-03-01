import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

import {BasicAccountSetupComponent} from './basic-account-setup.component';

@Injectable()
export class BasicAccountSetupDialogService {

  public dialogBasicAccountSetupRef: MatDialogRef<BasicAccountSetupComponent>;

  constructor(public dialog: MatDialog) {
  }

  public async openModal(data: any) {
    if (!document.getElementsByClassName('bas-dialog').length) {
      return new Promise((resolve, reject) => {
        this.dialogBasicAccountSetupRef = this.dialog.open(BasicAccountSetupComponent, {
          width: '900px',
          height: '635px',
          panelClass: 'bas-dialog',
          data: data,
          disableClose: true
        });

        this.dialogBasicAccountSetupRef.afterClosed()
          .subscribe((res: any) => {
            if (res) {
              return resolve(res);
            } else {
              return reject({status: 'error'});
            }
          }, (e) => reject(e));
      });
    }
  }
}
