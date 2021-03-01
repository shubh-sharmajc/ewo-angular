import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SaveInMediabookComponent} from './save-in-mediabook.component';

@Injectable()
export class SaveInMediabookDialogService {

  constructor(public dialog: MatDialog) {
  }

  public openModal(data: any) {
    if (!document.getElementsByClassName('save-in-mb').length) {
      this.dialog.open(SaveInMediabookComponent, {
        width: '600px',
        height: 'auto',
        disableClose: true,
        panelClass: 'save-in-mb',
        data: {data}
      });
    }
  }
}
