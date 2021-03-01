import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

import {ShareViaEmailComponent} from './share-via-email.component';
import {ShareViaEmailSuccessComponent} from './share-via-email-success/share-via-email-success.component';

@Injectable()
export class ShareViaEmailDialogService {
  public dialogShareViaEmailRef: MatDialogRef<ShareViaEmailComponent>;

  constructor(public dialog: MatDialog) {
  }

  public async share(imageObj: any) {
    return new Promise((resolve, reject) => {
      this.dialogShareViaEmailRef = this.dialog.open(ShareViaEmailComponent, {
        width: '400px',
        height: '510px',
        disableClose: true,
        data: {data: imageObj}
      });
      this.dialogShareViaEmailRef.afterClosed()
        .subscribe((res) => {
          if (res) {
            return resolve(res);
          } else {
            return reject({status: 'error'});
          }
        }, (e) => reject(e));
    });
  }

  public alert(message: any) {
    if (!document.getElementsByClassName('sve-alert-dialog').length) {
      this.dialog.open(ShareViaEmailSuccessComponent, {
        disableClose: true,
        height: '156px',
        width: '400px',
        panelClass: 'sve-alert-dialog',
        data: {message}
      });
    }
  }
}
