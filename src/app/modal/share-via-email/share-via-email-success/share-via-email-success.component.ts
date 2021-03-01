import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-share-via-email-success',
  templateUrl: './share-via-email-success.component.html',
  styleUrls: ['./share-via-email-success.component.scss']
})
export class ShareViaEmailSuccessComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ShareViaEmailSuccessComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
  }

  closeDialog(flag: any) {
    this.dialogRef.close(flag);
  }

}
