import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../_services/user/user.service';
import {AlertDialogService} from '../../modal/alert/alert-dialog.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm: FormGroup;
  public submitted: any;

  constructor(public router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private alertDialog: AlertDialogService) {

  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    try {
      const res: any = await this.userService.forgotPassword(this.forgotPasswordForm.getRawValue().email);
      if (res && res.status === 'success') {
        this.alertDialog.alert(res.message);
      }
    } catch (e) {
      if (e && e.error && e.error.message) {
        this.alertDialog.alert(e.error.message);
      }
    }
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }
}
