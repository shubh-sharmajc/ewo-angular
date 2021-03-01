import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {MediaBookService} from '../../../_services/media-book/media-book.service';
import {AlertDialogService} from '../../../modal/alert/alert-dialog.service';
import {SpaceValidator} from '../../../constant';

@Component({
  selector: 'app-create-media-book',
  templateUrl: './create-media-book.component.html',
  styleUrls: ['./create-media-book.component.scss']
})
export class CreateMediaBookComponent implements OnInit {

  public mediaBookForm: FormGroup;
  public submitted: any = false;
  public isDefault: any = false;
  public isAboutUs: any = false;
  public isShared: any = false;
  public errMsg: any;
  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<CreateMediaBookComponent>,
              private alertDialog: AlertDialogService,
              @Inject(MAT_DIALOG_DATA) public data,
              private mediaBookService: MediaBookService) {
    this.createForm();
  }

  ngOnInit() {
    this.isDefault = this.data && this.data._id && this.data.default;
    this.isAboutUs = this.data && this.data._id && this.data.default && this.data.seq == 2;
    this.isShared = this.data && this.data._id && this.data.shared;
    if (this.data) {
      this.updateForm();
    }
  }

  createForm() {
    this.mediaBookForm = this.formBuilder.group({
      name: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      desc: [''],
      private: [''],
    });
  }

  updateForm() {
    const name: string = this.data && this.data.name ? this.data.name : '';
    const desc: string = this.data && this.data.desc ? this.data.desc : '';
    const isPrivate: string = this.data && this.data.private ? this.data.private : false;
    this.mediaBookForm.patchValue({name, desc, private: isPrivate});
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.mediaBookForm.controls;
  }

  async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }

    // stop here if form is invalid
    if (this.mediaBookForm.invalid) {
      return;
    }

    try {
      if (this.data && this.data._id) {
        await this.mediaBookService.updateMediaBook(this.data._id, this.mediaBookForm.getRawValue());
        this.closeDialog(true);
      } else {
        const formValues = this.mediaBookForm.getRawValue();
        formValues.private = formValues.private !== false;
        const resp = await this.mediaBookService.createMediaBook(formValues);
        this.closeDialog(resp);
      }
    } catch (e) {
      this.errMsg = e.error.message;
      this.alertDialog.alert(this.errMsg);
      console.log('CreateMediaBookComponent -> onSubmit ::: ', e);
    }
  }

  closeDialog(data?: any) {
    this.dialogRef.close(data);
  }
}
