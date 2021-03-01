import {Component, Inject, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AlertComponent} from '../alert/alert.component';

@Component({
  selector: 'app-third-party-cookies',
  templateUrl: './third-party-cookies.component.html',
  styleUrls: ['./third-party-cookies.component.scss']
})
export class ThirdPartyCookiesComponent implements OnInit {

  constructor(public sanitizer: DomSanitizer,
              private dialogRef: MatDialogRef<AlertComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
