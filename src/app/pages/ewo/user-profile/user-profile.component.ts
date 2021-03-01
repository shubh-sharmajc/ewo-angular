import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import * as _ from 'lodash';

import {environment} from '../../../../environments/environment';
import {ProfileImageCropComponent} from '../../../modal/profile-image-crop/profile-image-crop.component';
import {ChangeCoverPhotoComponent} from '../../../modal/change-cover-photo/change-cover-photo.component';
import {AlertDialogService} from '../../../modal/alert/alert-dialog.service';
import {BroadcasterService} from '../../../_services/broadcaster/broadcaster.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  @ViewChild('avatar') avatar: ElementRef;
  public currentUser: any;
  public user: any;
  public userName: any = '';
  public username: string;
  public profileUrl: any;
  public dialogProfilePictureCropRef: MatDialogRef<ProfileImageCropComponent>;
  public dialogChangeCoverPhotoRef: MatDialogRef<ChangeCoverPhotoComponent>;
  public destroy$: any = new Subject<any>();

  constructor(public router: Router,
              private activatedRoute: ActivatedRoute,
              private store: Store<any>,
              public dialog: MatDialog,
              public broadcaster: BroadcasterService,
              private alertDialog: AlertDialogService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.username = params.username;
      this.profileUrl = `${environment.DISSCUSSION_LINK}user/` + this.username;
      this.getUserByUserName();
    });
    this.getLoginUser();
  }

  async getUserByUserName() {
    try {
      this.store.select('user')
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res && res.user && res.user.data) {
            this.user = res.user.data;
            this.userName = this.user.first_name + ' ' + this.user.last_name.charAt(0).toUpperCase() + '.';
          }
        });
    } catch (e) {
      console.log('UserProfileComponent -> getUserByUserName :: ', e);
    }
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
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

  async changeProfile(event) {
    const files: any = event.target.files;
    const fileType: any = files.length && new RegExp(/\.(jpe?g|png|)$/i).test(files[0].name);
    const fSize: any = this.getFileSize(files);
    if (fileType && ((fSize.fSExt === 'KB' && fSize.size >= 250) || (fSize.fSExt === 'MB' && fSize.size <= 4))) {
      this.dialogProfilePictureCropRef = this.dialog.open(ProfileImageCropComponent, {
        width: '754px',
        height: '600px',
        panelClass: 'profile-img-crop-dialog',
        data: event
      });
      this.dialogProfilePictureCropRef.afterClosed()
        .subscribe(() => {
          this.avatar.nativeElement.value = '';
        });
    } else {
      let msg = '';
      msg += 'Please note the image specs below:<br/>';
      msg += 'Optimal image dimensions: 400 X 400. ';
      msg += 'Image must be PNG or JPG and can be upto 4MB max size.';
      await this.alertDialog.alert(msg, '300px');
    }
  }

  changeCoverPhoto() {
    this.dialogChangeCoverPhotoRef = this.dialog.open(ChangeCoverPhotoComponent, {
      width: '946px',
      height: '750px',
      data: event
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
