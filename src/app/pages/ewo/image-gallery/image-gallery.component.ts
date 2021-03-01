import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import * as _ from 'lodash';
import * as op from 'object-path';

import {AppState} from '../../../app.state';
import {ImageGalleryService} from '../../../_services/image-gallery/image-gallery.service';
import {MainService} from '../../../_services/main.service';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../_services/user/user.service';
import {EditCommentComponent} from './edit-comment/edit-comment.component';
import {SignUpDialogService} from '../../../modal/sign-up-popup/sign-up-dialog.service';
import {SaveInMediabookDialogService} from '../../../modal/save-in-mediabook/save-in-mediabook-dialog.service';
import {DeleteDialogService} from '../../../modal/delete/delete-dialog.service';
import {ShareViaEmailDialogService} from '../../../modal/share-via-email/share-via-email-dialog.service';
import {AlertDialogService} from '../../../modal/alert/alert-dialog.service';
import {PRO_USER_ROLES, SpaceValidator} from '../../../constant';
import {ProReviewsService} from '../../../_services/pro-reviews/pro-reviews.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit, OnDestroy {
  public actionMenu: any = [{name: 'Flag'}];
  public myCommentActionMenu: any = [{name: 'Edit'}, {name: 'Delete'}];
  public commentActionMenu: any = [{name: 'Flag'}];
  public destroy$: any = new Subject<any>();
  public imgID: any;
  public submitted: any = false;
  public imgCarouselIndex: any = 0;
  public carouselArr: any = [];
  public imgObj: any;
  public commentList: any = [];
  public total_comments: any;
  public imageData: any = [];
  public editDialogRef: MatDialogRef<EditCommentComponent>;
  public WP_STORIES_LINK = `${environment.WP_STORIES_LINK}`;
  public isDefaultImgView: any = true;
  public isURLCopied: any = false;
  public isFollowing: any = false;
  public nodeBBLoginUserSlug: any;
  public currentUser: any;
  public showMoreText: any = false;
  public selectedAction: any = {name: ''};
  public commentAction: any = {name: ''};
  public commentForm: FormGroup;
  public commentID: any;
  public proUserRoles: any = PRO_USER_ROLES;
  public socialShare: any[] = [
    {url: 'https://www.facebook.com/sharer/sharer.php', type: 'FACEBOOK', name: 'Facebook', icon: 'assets/img/fb.svg'},
    {url: 'https://twitter.com/intent/tweet', type: 'TWEET', name: 'Tweet', icon: 'assets/img/twitter-w.svg'},
    {url: 'https://www.linkedin.com/shareArticle', type: 'LINKEDIN', name: 'Linkedin', icon: 'assets/img/linked-in.svg'}
  ];
  public selectedSocialShare: any = {name: ''};
  public equalComments: any = false;
  public disable = false;
  public mediabookid: any;
  public story_url: any;
  public business: any;
  public proUser: any;


  constructor(private store: Store<AppState>, private mainService: MainService,
              public dialog: MatDialog, public location: Location,
              public alertDialogService: AlertDialogService,
              private router: Router, private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              public sanitizer: DomSanitizer,
              private imgGalleryService: ImageGalleryService,
              private _userService: UserService,
              public signUpDialogService: SignUpDialogService,
              public saveInMediabookDialog: SaveInMediabookDialogService,
              private deleteDialog: DeleteDialogService,
              private shareViaEmailDialogService: ShareViaEmailDialogService,
              private proReviewsService: ProReviewsService) {
    this.createForm();
    this.activatedRoute.params.subscribe((params) => {
      // checking if its media book slideshow or gallary
      if (this.router.url.includes('mediabook/slideshow')) {
        this.mediabookid = params.id;
      } else if (this.router.url.includes('story/slideshow')) {
        this.story_url = params.story_url;
      } else {
        this.imgID = params.id;
      }
    });
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    this.getLoginUser();
    this.getProUser();
    this.getNodeBBLoginUserSlug();
    if (this.mediabookid) {
      this.getImageListMediabook();
    } else if (this.story_url) {
      this.getStoryImages();
    } else {
      this.getSingleImage();
      this.getSimilarImages();
      this.getComments();
    }
  }

  goTOBack() {
    if (this.story_url) {
      window.location.href = `${this.WP_STORIES_LINK}${this.story_url}`;
    } else {
      this.location.back();
    }
  }

  async getAuthorInfo(author: any) {
    if (this.proUserRoles.indexOf(op.get(author, 'role')) > -1) {
      author.name = op.get(author, 'business.name.name');
      const locations: any = op.get(author, 'business.locations');
      const loc = op.get(locations.find((o) => o.is_default), 'location');
      author.about_me = op.get(loc, 'description');
      const res: any = await this.proReviewsService.reviewOverview(op.get(author, 'business.name._id'), op.get(loc, '_id'));
      author.avgRatings = op.get(res, 'data.0.avgRatings') ? op.get(res, 'data.0.avgRatings') : 0;
    } else {
      author.name = op.get(author, 'name');
      author.about_me = op.get(author, 'about_me');
    }
  }

  createForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
    });
  }

  get f() {
    return this.commentForm.controls;
  }

  updateActionMenu(isFlag: any) {
    this.actionMenu = [{name: (isFlag ? 'Un-Flag' : 'Flag')}];
  }

  async menuChange(action) {
    this.selectedAction = {...this.selectedAction, name: ''};
    switch (action) {
      case 'Flag':
      case 'Un-Flag':
        this.toggleFlag();
        this.updateActionMenu(action === 'Flag');
        break;
    }
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }


  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.business = op.get(res.proUser, 'business');
        }
      });
  }

  checkUserLogin() {
    if (this.currentUser) {
      return true;
    } else {
      this.signUpDialogService.openModal(true);
      return false;
    }
  }

  async toggleFlag() {
    if (this.checkUserLogin()) {
      this.imgObj.like.is_flag = !this.imgObj.like.is_flag;
      this.likeOrFlagImage();
    }
  }

  async toggleLike(elem: any, rec: any) {
    if (this.currentUser) {
      this.disable = true;
      try {
        if (op.get(this.imgObj, 'like.is_like')) {
          const res = await this.imgGalleryService.likeOrFlagImage({
            user_id: op.get(this.currentUser, '_id'),
            image_id: rec._id,
            is_like: false,
            is_flag: false,
            api_type: 'like'
          });
          rec.total_like--;
          if (res) {
            this.imgObj.like.is_like = false;
            this.disable = false;
          }
        } else {
          const res = await this.imgGalleryService.likeOrFlagImage({
            user_id: op.get(this.currentUser, '_id'),
            image_id: rec._id,
            is_like: true,
            is_flag: false,
            api_type: 'like'
          });
          if (res) {
            this.imgObj.like.is_like = true;
            this.disable = false;
          }
          rec.total_like++;
        }
      } catch (e) {
        this.disable = false;
      }
    }
  }

  async likeOrFlagImage() {
    try {
      await this.imgGalleryService.likeOrFlagImage({
        user_id: this.currentUser._id,
        image_id: this.imgObj._id,
        is_like: this.imgObj.like.is_like,
        is_flag: this.imgObj.like.is_flag,
        api_type: 'like'
      });
    } catch (e) {
      console.log('ImageGalleryComponent -> likeOrFlagImage :: ', e);
    }
  }

  async getComments() {
    const resp: any = await this.imgGalleryService.getComments(this.imgID, false, true);
    this.total_comments = resp.data.total_comment;
    this.store.select('imageGallery')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.commentsList) {
          this.commentList = res.commentsList;
        }
      });
  }

  async readAllComment() {
    const resp: any = await this.imgGalleryService.getComments(this.imgID, true);
    if (resp.data.total_comment === resp.data.commentCount) {
      this.equalComments = true;
    }
  }

  async getSingleImage() {
    await this.imgGalleryService.getSingleImage(this.imgID);
    this.getImageGalleryList();
    this.store.select('imageGallery')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.image) {
          this.imgObj = res.image;
          const like: any = res.image.exp_like.find((o: any) => o.user_id === op.get(this.currentUser, '_id'));
          if (like) {
            this.imgObj.like = like;
            this.updateActionMenu(like.is_flag);
          } else {
            this.imgObj.like = {is_like: false, is_flag: false};
          }
          if (op.get(this.imgObj, 'author_id.username')) {
            if (this.currentUser) {
              this.getFollowerFollowingCount(op.get(this.imgObj, 'author_id.username'));
            }
            this.getAuthorInfo(this.imgObj.author_id);
          }
        }
      });
  }

  async getSingleImageMediaBook() {
    await this.imgGalleryService.getSingleImage(this.imgID);
    this.store.select('imageGallery')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.image) {
          this.imgObj = res.image;
          const index = this.carouselArr.findIndex((o: any) => o._id === this.imgObj._id);
          if (index === -1) {
            this.carouselArr.unshift(this.imgObj);
          }
          this.imgObj.is_gallery = true;
          const like: any = res.image.exp_like.find((o: any) => o.user_id === this.currentUser && this.currentUser._id);
          if (like) {
            this.imgObj.like = like;
            this.updateActionMenu(like.is_flag);
          } else {
            this.imgObj.like = {is_like: false, is_flag: false};
          }
          if (this.currentUser && this.imgObj && this.imgObj.author_id && this.imgObj.author_id.username) {
            this.getFollowerFollowingCount(this.imgObj.author_id.username);
          }
        }
      });
  }

  async getSimilarImages() {
    const res: any = await this.imgGalleryService.getSimilarImages(this.imgID);
    if (res && res.status === 'success') {
      this.imageData = res.imageData;
    }
  }

  async getImageGalleryList() {
    await this.imgGalleryService.getImageGalleryList(this.imgID);
    this.store.select('imageGallery')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.imgGalleryList) {
          this.carouselArr = res.imgGalleryList;
          const index = this.carouselArr.findIndex((o: any) => o._id === this.imgObj._id);
          if (index === -1) {
            this.carouselArr.unshift(this.imgObj);
          }
        }
      });
  }

  async getImageListMediabook() {
    const list: any = await this.imgGalleryService.getImageListMediabook(this.mediabookid);
    if (list && list.length) {
      this.carouselArr = list;
      this.imgID = op.get(list, '0._id');
      this.getSimilarImages();
      this.getSingleImageMediaBook();
      this.getComments();
    } else {
      if (op.get(this.currentUser, 'username')) {
        const PREFIX_URL: any = PRO_USER_ROLES.indexOf(op.get(this.currentUser, 'role')) > -1 ? '/pro/manage-media/' : '/user/';
        this.router.navigate([`${PREFIX_URL}${op.get(this.currentUser, 'username')}/mediabooks/${this.mediabookid}/items`]);
      }
    }
  }

  async getStoryImages() {
    const list: any = await this.imgGalleryService.getStoryImages(this.story_url);
    if (list && list.length) {
      this.carouselArr = list;
      this.imgID = op.get(list, '0._id');
      this.getSimilarImages();
      this.getSingleImageMediaBook();
      this.getComments();
    } else {
      this.router.navigate(['/']);
    }
  }

  openMenu($event: any) {
    $event.stopPropagation();
  }

  shareViaEmail() {
    if (this.currentUser) {
      this.shareViaEmailDialogService.share(this.imgObj).then(async (res) => {
        try {
          await this.imgGalleryService.shareViaEmail(this.imgObj._id, res);
          this.alertDialogService.alert('Email sent successfully.');
        } catch (e) {
          this.alertDialogService.alert('Email not sent.');
          console.log('ImageGalleryComponent -> shareViaEmail :: ', e);
        }
      });
    }
  }

  openSaveImageModal() {
    this.saveInMediabookDialog.openModal(this.imgObj);
  }

  toggleImgView() {
    this.isDefaultImgView = !this.isDefaultImgView;
  }

  copyURL() {
    const selBox: any = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = `${environment.SITE_URL}${this.router.url}`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.isURLCopied = true;
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

  async getFollowerFollowingCount(slug) {
    try {
      const resp: any = await this._userService.getFollowerFollowingCount(slug);
      if (resp.status === 'success') {
        this.isFollowing = resp.data && resp.data.isFollowing;
      }
    } catch (e) {
      console.log('ImageGalleryComponent -> getFollowerFollowingCount :: ', e);
    }
  }

  async followerFollowing(email) {
    try {
      const body: any = {};
      body.uuid = this.nodeBBLoginUserSlug.uuid;
      body.task = this.isFollowing ? 'unfollow' : 'follow';
      body.email = email;
      if (body.uuid && body.email) {
        await this._userService.followUnfollow(body);
        this.isFollowing = !this.isFollowing;
      }
    } catch (e) {
      console.log('ImageGalleryComponent -> followerFollowing :: ', e);
    }
  }

  async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }
    if (this.commentForm.invalid) {
      return;
    }
    await this.imgGalleryService.saveComment({
      user_id: this.currentUser._id,
      image_id: this.imgObj._id,
      currentUser: this.currentUser,
      comment: this.commentForm.getRawValue().comment
    });
    this.imgObj.total_comment += 1;
    this.commentForm.reset();
    this.submitted = false;
  }

  updateCommentActionMenu(flagged_by: any) {
    if (_.isArray(flagged_by)) {
      const index = _.findIndex(flagged_by, (o) => o === this.currentUser._id);
      this.commentActionMenu = [{name: (index === -1 ? 'Flag' : 'Un-Flag')}];
    } else {
      this.commentActionMenu = [{name: 'Flag'}];
    }
  }

  commentActionChange(action: any, commentObj: any) {
    this.commentAction = {...this.commentAction, name: ''};
    switch (action) {
      case 'Delete':
        this.deleteComment(commentObj._id);
        break;
      case 'Flag':
      case 'Un-Flag':
        this.flagComment(commentObj);
        break;
      case 'Edit':
        this.editComment(commentObj);
        break;
    }
  }

  async deleteComment(commentID) {
    this.deleteDialog.delete('Are you sure you want to delete this comment?')
      .then(async () => {
        try {
          await this.imgGalleryService.deleteComment(this.imgID, commentID);
          await this.imgGalleryService.getComments(this.imgID);
        } catch (e) {
          console.log('ImageGalleryComponent -> deleteComment :: ', e);
        }
      });
  }

  async flagComment(commentObj: any) {
    try {
      await this.imgGalleryService.flagComment(this.imgID, commentObj._id);
      if (_.isObject(commentObj) && _.isArray(commentObj.flagged_by)) {
        const index = _.findIndex(commentObj.flagged_by, (o) => o === this.currentUser._id);
        if (index === -1) {
          commentObj.flags++;
          commentObj.flagged_by.push(this.currentUser._id);
        } else {
          commentObj.flags--;
          commentObj.flagged_by.splice(index, 1);
        }
      } else {
        commentObj.flags++;
        commentObj.flagged_by.push(this.currentUser._id);
      }
    } catch (e) {
      console.log('ImageGalleryComponent -> flagComment :: ', e);
    }
  }

  async likeComment(commentObj: any) {
    try {
      await this.imgGalleryService.likeComment(this.imgID, commentObj._id);
      if (_.isObject(commentObj) && _.isArray(commentObj.liked_by)) {
        const index = _.findIndex(commentObj.liked_by, (o) => o === this.currentUser._id);
        if (index === -1) {
          commentObj.likes++;
          commentObj.liked_by.push(this.currentUser._id);
        } else {
          commentObj.likes--;
          commentObj.liked_by.splice(index, 1);
        }
      } else {
        commentObj.likes++;
        commentObj.liked_by.push(this.currentUser._id);
      }
    } catch (e) {
      console.log('ImageGalleryComponent ->likeComment :: ', e);
    }
  }

  editComment(commentObj) {
    commentObj.imgID = this.imgID;
    this.editDialogRef = this.dialog.open(EditCommentComponent, {
      disableClose: true,
      height: '320px',
      width: '400px',
      panelClass: 'edit-comment-dialog',
      data: commentObj
    });
  }


  resetForm() {
    this.commentForm.reset();
    this.submitted = false;
  }

  changeSocialShare(shareObj: any) {
    this.selectedSocialShare = {...this.selectedSocialShare, name: ''};
    let url = '';
    const title = this.imgObj.subject ? this.imgObj.subject : this.imgObj.title;
    switch (shareObj.type) {
      case 'FACEBOOK':
        url = `${shareObj.url}?u=${environment.SITE_URL}${this.router.url}&t=${title}`;
        window.open(url, shareObj.type, 'height=500,width=500');
        break;
      case 'TWEET':
        url = `${shareObj.url}?url=${environment.SITE_URL}${this.router.url}&text=${title}`;
        window.open(url, shareObj.type, 'height=500,width=500');
        break;
      case 'LINKEDIN':
        url = `${shareObj.url}?url=${environment.SITE_URL}${this.router.url}&title=${title}&mini=true`;
        window.open(url, shareObj.type, 'height=500,width=500');
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

  getNextMediaBookImageData(ind) {
    if (!this.mediabookid && !this.story_url) {
      return;
    }
    const nextItem = (this.carouselArr.length === ind + 1) ? 0 : ind + 1;
    this.imgID = this.carouselArr[nextItem]._id;
    this.getSingleImageMediaBook();
    this.getSimilarImages();
    this.getComments();
  }
}
