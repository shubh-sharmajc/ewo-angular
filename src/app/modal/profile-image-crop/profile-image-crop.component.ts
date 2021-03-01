import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {Store} from '@ngrx/store';
import * as _ from 'lodash';

import {UploadImageService} from '../../_services/upload-image/upload-image.service';

@Component({
  selector: 'app-profile-image-crop',
  templateUrl: './profile-image-crop.component.html',
  styleUrls: ['./profile-image-crop.component.scss']
})
export class ProfileImageCropComponent implements OnInit {
  public croppedImage: any = '';
  public imageChangedEvent: any;
  public image: any;
  public currentUser: any;
  public progress: any = 0;

  constructor(private store: Store<any>,
              public dialog: MatDialog,
              private dialogRef: MatDialogRef<ProfileImageCropComponent>,
              @Inject(MAT_DIALOG_DATA) private data,
              private uploadImageService: UploadImageService) {
    this.store.select('loginUser')
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  ngOnInit() {
    this.uploadImageService.progress.subscribe(value => {
      this.progress = value;
    });
    if (this.data && this.data.target && this.data.target.files && this.data.target.files[0]) {
      this.imageChangedEvent = this.data;
    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  async getCroppedImage() {
    const blob = this.dataURLtoBlob(this.croppedImage);
    const file = this.imageChangedEvent.target.files[0];
    const fd = new FormData();
    fd.append('picture', blob, file.name);
    await this.uploadImageService.uploadUserProfileImage(this.currentUser._id, fd);
    this.dialogRef.close(null);
  }

  dataURLtoBlob(dataurl) {
    const arr: any = dataurl.split(',');
    const mime: any = arr[0].match(/:(.*?);/)[1];
    const bstr: any = atob(arr[1]);
    let n: any = bstr.length;
    const u8arr: any = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  loadImageFailed() {

  }

  cropperReady() {

  }

  imageLoaded() {

  }
}
