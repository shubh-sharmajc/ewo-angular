import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';

import {IncompleteRegistrationComponent} from './incomplete-registration.component';

@Injectable()
export class IncompleteRegistrationDialogService {

  constructor(public dialog: MatDialog) {
  }

  public openModal(data?: any) {
    const isAnyDialogOpen: any = document.getElementsByClassName('incomplete-registration').length;
    if (!isAnyDialogOpen) {
      this.dialog.open(IncompleteRegistrationComponent, {
        disableClose: true,
        height: '330px',
        width: '640px',
        panelClass: 'incomplete-registration',
        data
      });
    }
  }
}
