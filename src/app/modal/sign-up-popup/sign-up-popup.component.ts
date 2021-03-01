import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService, FacebookLoginProvider} from 'angularx-social-login';
import {UserService} from '../../_services/user/user.service';
import {BasicAccountSetupDialogService} from '../basic-account-setup/basic-account-setup-dialog.service';
import {GoogleOAuthService} from '../../_services/google-oauth/google-oauth.service';
import {RegisteredEmailDialogService} from '../registered-email/registered-email-dialog.service';
import {IncompleteRegistrationDialogService} from '../incomplete-registration/incomplete-registration-dialog.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-sign-up-popup',
  templateUrl: './sign-up-popup.component.html',
  styleUrls: ['./sign-up-popup.component.scss']
})
export class SignUpPopupComponent implements OnInit {

  public registerForm: FormGroup;
  public submitted: any = false;
  public WP_LINK = `${environment.WP_LINK}`;

  constructor(private dialogRef: MatDialogRef<SignUpPopupComponent>,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private authService: AuthService,
              private userService: UserService,
              private basicAccountSetupDialog: BasicAccountSetupDialogService,
              public googleOAuth: GoogleOAuthService,
              private registeredEmailDialog: RegisteredEmailDialogService,
              private incompleteRegistrationDialog: IncompleteRegistrationDialogService) {
  }

  ngOnInit() {
    this.createRegisterForm();
  }

  get f() {
    return this.registerForm.controls;
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmitRegister() {
    if (!this.submitted) {
      this.submitted = true;
    }

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.openBasicAccountSetupModal(this.registerForm.value);
  }

  signUpWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((resp: any) => {
        resp.social_type = 'facebook';
        this.openBasicAccountSetupModal(resp);
      });
  }

  signUpWithGoogle(): void {
    this.googleOAuth.signUp()
      .then((resp: any) => {
        this.openBasicAccountSetupModal(resp);
      });
  }

  async openBasicAccountSetupModal(data) {
    const resp: any = await this.userService.checkUserEmailExist(data.email);
    if (resp && resp.data && resp.data.email_verify) {
      this.closeDialog();
      this.registeredEmailDialog.openModal(data);
    } else if (resp && resp.data && !resp.data.email_verify) {
      this.closeDialog();
      this.incompleteRegistrationDialog.openModal(data);
    } else {
      this.closeDialog();
      this.basicAccountSetupDialog.openModal(data)
        .then(() => {
          this.registerForm.reset();
        });
    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
