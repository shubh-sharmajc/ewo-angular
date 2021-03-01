import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {MatDialog, MatDialogRef} from '@angular/material';
import {takeUntil} from 'rxjs/operators/index';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import * as op from 'object-path';
import * as moment from 'moment';

import {environment} from '../../../../environments/environment';
import {UserService} from '../../../_services/user/user.service';
import {AlertDialogService} from '../../../modal/alert/alert-dialog.service';
import {ProfileImageCropComponent} from '../../../modal/profile-image-crop/profile-image-crop.component';
import {ChangeCoverPhotoComponent} from '../../../modal/change-cover-photo/change-cover-photo.component';
import {WriteAReviewService} from '../../../modal/pro-modal/write-a-review/write-a-review.service';
import {ContactUsService} from '../../../modal/pro-modal/contact-us/contact-us.service';
import {AuthService} from '../../../_services/auth/auth.service';
import {ProUserService} from '../../../_services/pro-user/pro-user.service';
import {ProReviewsService} from '../../../_services/pro-reviews/pro-reviews.service';
import {USER_ROLES} from '../../../constant';
import {SaveInMediabookDialogService} from '../../../modal/save-in-mediabook/save-in-mediabook-dialog.service';

@Component({
  selector: 'app-pro-user-profile',
  templateUrl: './pro-user-profile.component.html',
  styleUrls: ['./pro-user-profile.component.scss']
})
export class ProUserProfileComponent implements OnInit, OnDestroy {

  @ViewChild('avatar') avatar: ElementRef;
  public username: any;
  public profileUrl: any;
  public currentUser: any;
  public user: any;
  public ffData: any;
  public destroy$: any = new Subject<any>();
  public dialogProfilePictureCropRef: MatDialogRef<ProfileImageCropComponent>;
  public proUser: any;
  public business: any;
  public location: any;
  private user_id: any;
  public avgRatings: any = 0;
  public totRatings: any = 0;
  public bLocation: any;
  public selectedLoc: any;
  public locationId: any;
  public userRoles: any = USER_ROLES;
  public nodeBBLoginUserSlug: any;

  constructor(public router: Router,
              private writeAReviewDialogService: WriteAReviewService,
              private activatedRoute: ActivatedRoute,
              private auth: AuthService,
              private contactUsDialogService: ContactUsService,
              private store: Store<any>,
              public dialog: MatDialog,
              public proUserService: ProUserService,
              private _userService: UserService,
              private alertDialog: AlertDialogService,
              private proReviewsService: ProReviewsService,
              public saveInMediabookDialog: SaveInMediabookDialogService) {
    this.activatedRoute.params.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.username = op.get(params, 'username');
        this.profileUrl = `${environment.DISSCUSSION_LINK}user/${this.username}`;
      });
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.locationId = op.get(params, 'locId');
        this.updateLocationData();
      });
  }

  ngOnInit() {
    this.getLoginUser();
    this.getProUser();
    this.getNodeBBLoginUserSlug();
  }

  saveProToMB() {
    const bLocation: any = op.get(this.user, 'business.locations', []);
    const selectedLoc: any = bLocation.find((o: any) => o.is_default);
    const location = op.get(selectedLoc, 'location');
    const newObj: any = {};
    newObj._id = op.get(this.user, '_id', '');
    newObj.content = op.get(this.user, 'username', '');
    newObj.subject = op.get(this.user, 'business.name.name', '');
    newObj.description = op.get(location, 'description', '');
    newObj.picture_thumb_url = op.get(this.user, 'picture_url', '');
    newObj.type = 'PRO';
    this.saveInMediabookDialog.openModal(newObj);
  }

  getUserByUserName() {
    try {
      this.store.select('user')
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (res) => {
          const user: any = op.get(res, 'user.data');
          if (user) {
            this.user = user;
            this.getFollowerFollowingCount(this.user.username);
            if (user.username !== op.get(this.currentUser, 'username')) {
              await this.auth.getProUser(user._id);
            }
          }
        });
    } catch (e) {
      console.log('ProUserProfileComponent -> getUserByUserName :: ', e);
    }
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.user_id = res.proUser._id;
          this.proUser = res.proUser;
          this.business = op.get(res.proUser, 'business');
          this.business.launch = moment(this.business.launch).format('MMMM YYYY');
          this.updateLocationData();
        }
      });
  }

  getNodeBBLoginUserSlug() {
    this.store.select('nodeBB')
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (res) => {
        if (res && res.loginUserSlug && res.loginUserSlug.data) {
          this.nodeBBLoginUserSlug = res.loginUserSlug.data;
        }
      });
  }

  updateLocationData() {
    this.bLocation = op.get(this.business, 'locations', []);
    this.selectedLoc = this.bLocation.find((o: any) => {
      return this.locationId ? this.locationId === op.get(o, 'location._id') : o.is_default;
    });
    this.location = op.get(this.selectedLoc, 'location');
    if (this.location) {
      const address: string = op.get(this.location, 'address', '');
      const city: string = op.get(this.location, 'city', '');
      const state: string = op.get(this.location, 'state', '');
      const stateCode: string = op.get(this.location, 'st', '');
      const zip: string = op.get(this.location, 'zip', '');
      this.location.locFormat1 = [city, stateCode].filter((o) => o).join(', ').trim();
      this.location.locFormat2 = [address, city].filter((o) => o).join(', ').trim();
      this.location.locFormat3 = [stateCode, zip].filter((o) => o).join(', ').trim();
      this.reviewOverview();
    }
  }

  public locationChange() {
    this.locationId = op.get(this.selectedLoc, 'location._id');
    const URL: any = this.router.url.split('?')[0];
    switch (URL) {
      case `/pro/user/${this.username}`:
      case `/pro/user/${this.username}/review`:
        this.router.navigate([URL], {queryParams: {locId: this.locationId}});
        break;
    }
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
        this.getUserByUserName();
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
      this.alertDialog.alert(msg, '300px');
    }
  }

  changeCoverPhoto() {
    this.dialog.open(ChangeCoverPhotoComponent, {
      width: '946px',
      height: '750px',
      data: event
    });
  }

  async getFollowerFollowingCount(slug) {
    try {
      const resp: any = await this._userService.getFollowerFollowingCount(slug);
      if (resp.status === 'success') {
        this.ffData = {};
        this.ffData.follower = resp.data && resp.data.follower ? resp.data.follower : 0;
        this.ffData.following = resp.data && resp.data.following ? resp.data.following : 0;
        this.ffData.isFollowing = resp.data && resp.data.isFollowing;
      }
    } catch (e) {
      console.log('ViewProfileComponent -> getFollowerFollowingCount :: ', e);
    }
  }

  writeReview() {
    this.writeAReviewDialogService.openWriteAReviewModal()
      .then(() => {
        this.listReviews();
        this.reviewOverview();
      });
  }

  contactUs() {
    this.contactUsDialogService.openContactUsModal();
  }

  async publishProfile() {
    const data = {is_published: true};
    await this.proUserService.updateProUser(this.user_id, op.get(this.location, '_id'), data);
    await this.auth.getProUser();
  }

  async listReviews() {
    await this.proReviewsService.listReviews(op.get(this.business, '_id'), op.get(this.location, '_id'));
  }

  async reviewOverview() {
    const res: any = await this.proReviewsService.reviewOverview(op.get(this.business, '_id'), op.get(this.location, '_id'));
    if (res && res.data) {
      this.avgRatings = op.get(res, 'data.0.avgRatings', 0);
      this.totRatings = op.get(res, 'data.0.total', 0);
    }
  }

  async followerFollowing() {
    try {
      const body: any = {};
      body.uuid = this.nodeBBLoginUserSlug.uuid;
      body.task = (this.ffData && this.ffData.isFollowing) ? 'unfollow' : 'follow';
      body.email = this.user.email;
      if (body.uuid && body.email) {
        await this._userService.followUnfollow(body);
        await this.getFollowerFollowingCount(this.user.username);
      }
    } catch (e) {
      console.log('ProUserProfileComponent -> getFollowerFollowingCount :: ', e);
    }
  }

  public toggleLeftSideInfo() {
    let isShow: any = false;
    switch (this.router.url.split('?')[0]) {
      case `/pro/user/${this.username}`:
      case `/pro/user/${this.username}/review`:
        isShow = true;
        break;
    }
    return isShow;
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
