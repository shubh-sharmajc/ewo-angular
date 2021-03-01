import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators/index';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import * as op from 'object-path';

import {MediaBookService} from '../../../../_services/media-book/media-book.service';
import {UserService} from '../../../../_services/user/user.service';
import {AuthService} from '../../../../_services/auth/auth.service';
import {PRO_USER_ROLES} from '../../../../constant';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-pro-user-view-profile',
  templateUrl: './pro-user-view-profile.component.html',
  styleUrls: ['./pro-user-view-profile.component.scss']
})
export class ProUserViewProfileComponent implements OnInit, OnDestroy {

  public isReadMore: any = false;
  public currentUser: any;
  public user: any;
  public destroy$: any = new Subject<any>();
  public mediaBookList: any[];
  public proUser: any;
  public business: any;
  public location: any;
  public coverImage: any = '';
  public proUserRoles: any = PRO_USER_ROLES;
  public instructions = 'Click on the above image to visit the About Us Mediabook and upload a new image (for e.g. your team).';
  public selectedLoc: any;
  public locationId: any;
  public aboutUs: any;

  constructor(private activatedRoute: ActivatedRoute,
              private store: Store<any>,
              private auth: AuthService,
              private router: Router,
              private _userService: UserService,
              private mediaBookService: MediaBookService) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.locationId = op.get(params, 'locId');
        this.updateLocationData();
      });
  }

  ngOnInit() {
    this.getUserByUserName();
  }

  readMore() {
    this.isReadMore = !this.isReadMore;
  }

  getUserByUserName() {
    this.store.select('user')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.user && res.user.data) {
          this.user = res.user.data;
          this.coverImage = op.get(this.user, 'about_us_image') ? op.get(this.user, 'about_us_image') : this.getImgForEmptyMB('About Us');
          this.getLoginUser();
          this.getProUser();
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

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.business = op.get(res.proUser, 'business');
          this.updateLocationData();
        }
      });
  }

  updateLocationData() {
    const bLocation: any = op.get(this.business, 'locations', []);
    this.selectedLoc = bLocation.find((o: any) => {
      return this.locationId ? this.locationId === op.get(o, 'location._id') : o.is_default;
    });
    this.location = op.get(this.selectedLoc, 'location');
  }

  navigateToAboutUs() {
    if (op.get(this.aboutUs, '_id')) {
      this.router.navigate([`/pro/manage-media/${this.user.username}/mediabooks/${op.get(this.aboutUs, '_id')}/items`]);
    }
  }

  async getMediaBooks() {
    const userID: any = this.currentUser && this.user && this.currentUser.username !== this.user.username && this.user._id;
    await this.mediaBookService.getMediaBookList(1, userID, true);
    this.store.select('mediaBook')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.list) {
          this.aboutUs = _.find(res.list, function (resp) {
            return resp.name === 'About Us';
          });
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

  getImgForEmptyMB(name?: string) {
    let URL: string;
    switch (name) {
      case 'Saved Items':
        URL = 'assets/img/mediabook/saved-items-mediabook.png';
        break;
      case 'Uploaded Items':
        URL = 'assets/img/mediabook/uploaded-items-mediabook.png';
        break;
      case 'About Us':
        URL = 'assets/img/mediabook/about-us.png';
        break;
      default:
        URL = 'assets/img/mediabook/new-mediabook.png';
    }
    return `${URL}`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
