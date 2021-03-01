import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DeleteComponent} from './delete.component';

@Injectable()
export class DeleteDialogService {

  private deleteDialogRef: MatDialogRef<DeleteComponent>;

  constructor(public dialog: MatDialog) {
  }

  public async delete(message: any) {
    return new Promise((resolve, reject) => {
      if (!document.getElementsByClassName('delete-dialog').length) {
        this.deleteDialogRef = this.dialog.open(DeleteComponent, {
          disableClose: true,
          height: '264px',
          width: '893px',
          panelClass: 'delete-dialog',
          data: {message}
        });

        this.deleteDialogRef.afterClosed()
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
