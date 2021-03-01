import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {UserService} from '../../../_services/user/user.service';
import {AlertDialogService} from '../../../modal/alert/alert-dialog.service';
import {MustMatch} from '../../../_helpers/must-match.validator';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public submitted: any;
  public resetToken: any;
  public resetPasswordForm: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private alertDialog: AlertDialogService) {
    this.activatedRoute.params.subscribe(async (params: any) => {
      this.resetToken = params.token;
    });
  }

  ngOnInit() {
    const strPattern: any = /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}$/;
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern(strPattern)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    try {
      const formData: any = this.resetPasswordForm.getRawValue();
      const res: any = await this.userService.resetPassword(this.resetToken, {password: formData.newPassword});
      if (res && res.status === 'success') {
        this.alertDialog.alert(res.message);
        this.router.navigate(['/signin']);
      }
    } catch (e) {
      if (e && e.error && e.error.message) {
        this.alertDialog.alert(e.error.message);
      }
    }
  }

  get f() {
    return this.resetPasswordForm.controls;
  }
}
