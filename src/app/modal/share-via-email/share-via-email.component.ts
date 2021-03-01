import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-share-via-email',
  templateUrl: './share-via-email.component.html',
  styleUrls: ['./share-via-email.component.scss']
})
export class ShareViaEmailComponent implements OnInit {

  public shareViaEmailForm: FormGroup;
  public submitted: any = false;
  public imageData: any;

  constructor(private dialogRef: MatDialogRef<ShareViaEmailComponent>,
              private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) {
    this.createForm();
  }

  ngOnInit() {
    if (this.data) {
      this.imageData = this.data.data;
      if (this.imageData) {
        this.updateForm();
      }
    }
  }

  createForm() {
    const EMAIL_REGEXP: any = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
    this.shareViaEmailForm = this.formBuilder.group({
      emails: ['', [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
      subject: [{value: ''}, Validators.required],
      message: ['Sending you some cool stuff I found on EWO. Let me know what you think!']
    });
  }

  updateForm() {
    const subject: any = this.imageData && this.imageData.subject ? this.imageData.subject : (this.imageData.title ? this.imageData.title : '');
    this.shareViaEmailForm.patchValue({subject});
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.shareViaEmailForm.controls;
  }

  async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }

    // stop here if form is invalid
    if (this.shareViaEmailForm.invalid) {
      return;
    }

    this.closeDialog(this.shareViaEmailForm.getRawValue());
  }

  closeDialog(data?: any) {
    this.dialogRef.close(data);
  }

}
