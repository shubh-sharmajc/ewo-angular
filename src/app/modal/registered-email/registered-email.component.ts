import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registered-email',
  templateUrl: './registered-email.component.html',
  styleUrls: ['./registered-email.component.scss']
})
export class RegisteredEmailComponent implements OnInit {

  public email: any;

  constructor(private router: Router,
              private dialogRef: MatDialogRef<RegisteredEmailComponent>,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit() {
    this.email = this.data && this.data.email;
  }


  closeDialog() {
    this.dialogRef.close(null);
  }

}
