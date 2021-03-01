import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';

import {RegisteredEmailComponent} from './registered-email.component';

@Injectable()
export class RegisteredEmailDialogService {

  constructor(public dialog: MatDialog) {
  }

  public openModal(data?: any) {
    const isAnyDialogOpen: any = document.getElementsByClassName('registered-email').length;
    if (!isAnyDialogOpen) {
      this.dialog.open(RegisteredEmailComponent, {
        disableClose: true,
        height: '330px',
        width: '718px',
        panelClass: 'registered-email',
        data: data
      });
    }
  }
}
