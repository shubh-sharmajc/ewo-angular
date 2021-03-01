import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {UserService} from '../../_services/user/user.service';
import {VerifyEmailService} from '../../_services/verify-email/verify-email.service';

@Component({
  selector: 'app-incomplete-registration',
  templateUrl: './incomplete-registration.component.html',
  styleUrls: ['./incomplete-registration.component.scss']
})
export class IncompleteRegistrationComponent implements OnInit {

  public email: any;
  public status: any;

  constructor(private router: Router,
              private dialogRef: MatDialogRef<IncompleteRegistrationComponent>,
              @Inject(MAT_DIALOG_DATA) private data,
              private userService: UserService,
              private verifyEmailService: VerifyEmailService) {
  }

  ngOnInit() {
    this.email = this.data && this.data.email;
  }

  async incompleteRegistration() {
    await this.userService.incompleteRegistration(this.email);
    this.closeDialog();
    this.router.navigate(['/']);
  }

  async sendEmailNotification() {
    if (this.data && this.data.email) {
      const res: any = await this.verifyEmailService.sendEmailVerification(this.data.email);
      this.status = res.status;
    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
