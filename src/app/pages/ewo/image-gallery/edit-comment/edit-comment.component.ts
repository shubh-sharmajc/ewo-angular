import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ImageGalleryService} from '../../../../_services/image-gallery/image-gallery.service';
import {SpaceValidator} from '../../../../constant';

@Component({
  selector: 'app-edit',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent implements OnInit {
  public commentsForm: FormGroup;
  public submitted: any = false;
  constructor(private dialogRef: MatDialogRef<EditCommentComponent>, private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data, private imgGalleryService: ImageGalleryService) {
    this.createForm();
  }

  ngOnInit() {
    this.commentsForm.patchValue({comment: this.data.comment});
  }

  createForm() {
    this.commentsForm = this.formBuilder.group({
      comment: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
    });
  }
  get f() {
    return this.commentsForm.controls;
  }
  closeDialog(flag: any) {
    this.dialogRef.close(flag);
  }

  async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }
    if (this.commentsForm.invalid) {
      return;
    }
    const comment = {comment: this.commentsForm.getRawValue().comment};
    const data = {imgID: this.data.imgID, commentID: this.data._id, comment: comment};
    await this.imgGalleryService.updateComment(data);
    this.closeDialog(true);
  }
}
