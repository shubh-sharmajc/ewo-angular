import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {

  public name: any;

  constructor(private dialogRef: MatDialogRef<CompleteRegistrationComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    if (this.data && this.data.user) {
      this.name = `${this.data.user.first_name} ${this.data.user.last_name}`;
    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
