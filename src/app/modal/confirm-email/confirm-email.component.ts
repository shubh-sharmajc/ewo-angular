import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {VerifyEmailService} from '../../_services/verify-email/verify-email.service';
import {AlertDialogService} from '../alert/alert-dialog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  public status: any;

  constructor(private dialogRef: MatDialogRef<ConfirmEmailComponent>,
              @Inject(MAT_DIALOG_DATA) private data, public dialog: MatDialog,
              private router: Router,
              private verifyEmailService: VerifyEmailService,
              private alertDialog: AlertDialogService) {
  }

  ngOnInit() {
  }

  async sendEmailNotification() {
    if (this.data && this.data.email) {
      const res: any = await this.verifyEmailService.sendEmailVerification(this.data.email);
      this.status = res.status;
      if (res && res.status === 'success') {
        this.closeDialog();
        this.alertDialog.alert('Email sent successfully.');
      } else if (res && res.status === 'info' && res.message === 'Email already verified.') {
        this.closeDialog();
        this.alertDialog.alert('Email already verified.');
        this.router.navigate(['/']);
      }
    }
  }

  closeDialog() {
    this.dialogRef.close(1);
  }

}
