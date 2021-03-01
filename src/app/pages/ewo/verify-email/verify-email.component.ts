import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import * as op from 'object-path';

import {AuthService} from '../../../_services/auth/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  public verifyToken: any;
  public email: any;

  constructor(public router: Router,
              private activatedRoute: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private _auth: AuthService) {
    this.activatedRoute.queryParams.subscribe(async (params: any) => {
      this.verifyToken = params.verifyToken;
      this.email = params.email;
    });
  }

  ngOnInit() {
    this.verifyEmail();
  }

  async verifyEmail() {
    try {
      if (this.verifyToken && this.email) {
        this.spinner.show();
        const res: any = await this._auth.verifyEmailToken(this.verifyToken, this.email);
        this.spinner.hide();
        if (op.get(res, 'status') === 'success') {
          this.router.navigate([`/user/${op.get(res, 'user.username')}/edit-profile`]);
        } else {
          this.router.navigate(['/']);
        }
      }
    } catch (e) {
      console.error('VerifyEmailComponent -> verifyEmail ::: ', e);
      this.spinner.hide();
      this.router.navigate(['/']);
    }
  }
}
