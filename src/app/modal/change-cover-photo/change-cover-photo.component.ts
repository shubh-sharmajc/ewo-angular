import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {Store} from '@ngrx/store';
import * as _ from 'lodash';

import {environment} from '../../../environments/environment';
import {UploadImageService} from '../../_services/upload-image/upload-image.service';
import {AlertDialogService} from '../alert/alert-dialog.service';

@Component({
  selector: 'app-cover-photo',
  templateUrl: './change-cover-photo.component.html',
  styleUrls: ['./change-cover-photo.component.scss']
})
export class ChangeCoverPhotoComponent implements OnInit {
  public DISSCUSSION_LINK: any = environment.DISSCUSSION_LINK;
  public currentUser: any;
  public showUpdatePhotoView: any = true;
  public coverImageChangedEvent: any;
  public dragImageFile: any;
  public showImage: any;
  public croppedImage: any;
  public imageURL: any;
  public ewoGalleryArr = [
    {path: 'assets/img/cover-img-gallery/1.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/2.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/3.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/4.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/5.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/6.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/7.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/8.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/9.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/10.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/11.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/12.jpg', isSelect: false}
  ];
  public errMsg: any = false;
  public progress: any = 0;

  constructor(private store: Store<any>,
              public dialog: MatDialog,
              private dialogRef: MatDialogRef<ChangeCoverPhotoComponent>,
              private uploadImageService: UploadImageService,
              private alertDialog: AlertDialogService) {
  }

  ngOnInit() {
    this.uploadImageService.progress.subscribe(value => {
      this.progress = value;
    });
    this.store.select('loginUser')
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  getCoverImage() {
    if (document.getElementById('getCoverImageFile')) {
      document.getElementById('getCoverImageFile').click();
    }
  }

  getFileSize(files: any): any {
    let size = files[0].size;
    const fSExt: any = new Array('Bytes', 'KB', 'MB', 'GB');
    let i = 0;
    while (size > 900) {
      size /= 1024;
      i++;
    }
    return {size: Math.round(Math.round(size * 100) / 100), fSExt: fSExt[i]};
  }

  checkFileSize(files: any) {
    const fSize: any = this.getFileSize(files);
    if ((fSize.fSExt === 'KB' && fSize.size >= 300) || (fSize.fSExt === 'MB' && fSize.size <= 8)) {
      return true;
    } else {
      let msg = '';
      msg += 'Please note the image specs below:<br/>';
      msg += 'Optimal image dimensions: 1536 X 768. ';
      msg += 'Image must be PNG or JPG and can be upto 8MB max size.';
      this.alertDialog.alert(msg, '300px');
      return false;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.errMsg = false;
    this.croppedImage = event.base64;
  }

  changeCoverImage(event) {
    if (event) {
      if (this.checkFileSize(event.target.files)) {
        this.coverImageChangedEvent = event;
        this.showImage = true;
      }
    }
  }

  imageLoaded() {

  }

  cropperReady() {

  }

  loadImageFailed() {

  }

  selectImage(index) {
    this.errMsg = false;
    this.ewoGalleryArr = this.ewoGalleryArr.map((d, i) => {
      d.isSelect = i === index;
      return d;
    });
  }

  readFileFromImg() {
    const self = this;
    const selectedImg: any = this.ewoGalleryArr.find((o) => o.isSelect);
    if (selectedImg) {
      this.imageURL = selectedImg.path;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.imageURL, true);
      xhr.responseType = 'blob';
      xhr.onload = function (e) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          self.croppedImage = event.target.result;
          self.getCoverCroppedImage();
        };
        reader.readAsDataURL(this.response);
      };
      xhr.send();
    } else {
      this.errMsg = true;
    }
  }

  filesDropped(files: any[]) {
    this.errMsg = false;
    if (files && files.length) {
      if (this.checkFileSize(files.map((o) => o.file))) {
        this.dragImageFile = files[0].file;
        this.showImage = true;
      }
    }
  }

  async getCoverCroppedImage() {
    if (this.croppedImage) {
      const blob = this.dataURLtoBlob(this.croppedImage);
      let file = null;
      if (this.dragImageFile) {
        file = this.dragImageFile;
      } else if (this.imageURL) {
        file = {name: `${Date.now()}.jpg`};
      } else if (this.coverImageChangedEvent.target.files[0]) {
        file = this.coverImageChangedEvent.target.files[0];
      }
      const fd = new FormData();
      fd.append('picture', blob, file.name);
      fd.append('cover_picture', 'true');
      await this.uploadImageService.uploadUserProfileImage(this.currentUser._id, fd);
      this.closeDialog();
    } else {
      this.errMsg = true;
    }
  }

  dataURLtoBlob(dataurl) {
    const arr: any = dataurl.split(',');
    const mime: any = arr[0].match(/:(.*?);/)[1];
    const bstr: any = atob(arr[1]);
    const arrayBuffer = new ArrayBuffer(bstr.length);
    const u8arr: any = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], {type: mime});
  }
}
