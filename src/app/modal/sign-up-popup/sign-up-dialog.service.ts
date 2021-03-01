import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';

import {AuthService} from '../../_services/auth/auth.service';
import {SignUpPopupComponent} from './sign-up-popup.component';

@Injectable()
export class SignUpDialogService {

  constructor(public dialog: MatDialog,
              public _router: Router,
              private _auth: AuthService) {
  }

  public openModal(isOpen?: any) {
    const isAnyDialogOpen: any = document.getElementsByClassName('mat-dialog-container').length;
    if (!isAnyDialogOpen && !this._auth.getToken() && this._router.url !== '/' && !this._router.url.includes('growth') && !this._router.url.includes('signin')
      && !this._router.url.includes('password') && !this._router.url.includes('pro')) {
      this.dialog.open(SignUpPopupComponent, {panelClass: 'sign-up-dialog', maxWidth: '100vw', maxHeight: '100vh'});
    } else if (isOpen) {
      this.dialog.open(SignUpPopupComponent, {panelClass: 'sign-up-dialog', maxWidth: '100vw', maxHeight: '100vh'});
    }
  }
}
