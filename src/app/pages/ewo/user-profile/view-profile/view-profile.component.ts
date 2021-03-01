import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';

import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../_services/user/user.service';
import {MediaBookService} from '../../../../_services/media-book/media-book.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit, OnDestroy {

  public currentUser: any;
  public user: any;
  public nodeBBLoginUserSlug: any;
  public showMoreText: any = false;
  public ffData: any;
  public profileUrl: string;
  public destroy$: any = new Subject<any>();
  public mediaBookList: any[];

  constructor(private store: Store<any>,
              private _userService: UserService,
              private mediaBookService: MediaBookService,
              private router: Router) {
  }

  ngOnInit() {
    this.getNodeBBLoginUserSlug();
    this.getUserByUserName();
  }

  getUserByUserName() {
    this.store.select('user')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.user && res.user.data) {
          this.user = res.user.data;
          this.profileUrl = `${environment.DISSCUSSION_LINK}user/${this.user.username}`;
          this.getFollowerFollowingCount(this.user.username);
          this.getLoginUser();
        }
      });
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
        this.getMediaBooks();
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
      console.log('ViewProfileComponent -> getFollowerFollowingCount :: ', e);
    }
  }

  async getMediaBooks() {
    const userID: any = this.currentUser && this.user && this.currentUser.username !== this.user.username && this.user._id;
    await this.mediaBookService.getMediaBookList(1, userID, true);
    this.store.select('mediaBook')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.list) {
          const sortedItems = _.sortBy(res.list, function (resp) {
            return resp.default ? 0 : 1;
          });
          this.mediaBookList = sortedItems.map((o: any) => {
            if (_.isObject(o.created_by)) {
              o.shared = o.created_by._id !== (this.user && this.user._id);
            } else {
              o.shared = o.created_by !== (this.user && this.user._id);
            }
            return o;
          });
        }
      });
  }

  getImgForEmptyMB(name: string) {
    let URL: string;
    switch (name) {
      case 'Saved Items':
        URL = 'assets/img/mediabook/saved-items-mediabook.png';
        break;
      case 'Uploaded Items':
        URL = 'assets/img/mediabook/uploaded-items-mediabook.png';
        break;
      case 'About us':
        URL = 'assets/img/mediabook/about-us.png';
        break;
      default:
        URL = 'assets/img/mediabook/new-mediabook.png';
    }
    return `url(${URL})`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

  openMediaBookList(user, mediaBookList) {
    if (['pro-basic', 'pro-premium'].indexOf(this.currentUser.role) > -1) {
      this.router.navigate(['/pro/manage-media/' + user.username + '/mediabooks/' + mediaBookList._id + '/items']);
    } else {
      this.router.navigate(['/user/' + user.username + '/mediabooks/' + mediaBookList._id + '/items']);
    }
  }
}
