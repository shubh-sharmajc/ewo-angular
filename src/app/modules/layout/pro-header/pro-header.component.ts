import {HttpClient} from '@angular/common/http';
import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators/index';
import * as _ from 'lodash';
import * as op from 'object-path';

import {environment} from '../../../../environments/environment';
import {AppState} from '../../../app.state';
import {MainService} from '../../../_services/main.service';
import {AuthService} from '../../../_services/auth/auth.service';
import {PRO_USER_ROLES} from '../../../constant';

@Component({
  selector: 'app-pro-header',
  templateUrl: './pro-header.component.html',
  styleUrls: ['./pro-header.component.scss']
})
export class ProHeaderComponent implements OnInit, OnDestroy {

  public currentUser: any;
  public WP_LINK = `${environment.WP_LINK}`;
  public disscussion_link = `${environment.DISSCUSSION_LINK}`;
  public preUrl: any;
  public searchStr: any = '';
  public showSearchList = false;
  public showTrendingList = false;
  public searchList = [
    {'icon': 'helpicon', 'key': 'recent', 'name': 'Searches', 'result': []},
    {'icon': 'photoicon', 'key': 'photoicon', 'name': 'Photos', 'result': []},
    {'icon': 'bookicon', 'key': 'bookicon', 'name': 'Stories', 'result': []},
    {'icon': 'prosicon', 'key': 'prosicon', 'name': 'Pros', 'result': []},
    {'icon': 'adviceicon', 'key': 'adviceicon', 'name': 'Conversations', 'result': []},
    {'icon': 'usericon', 'key': 'usericon', 'name': 'Users', 'result': []},
    {'icon': 'helpicon', 'key': 'helpicon', 'name': 'Help', 'result': []}];
  public isOpenMenu = false;
  public showDropDown = false;
  public showMoDropDwon = false;
  public manageUrl: String;
  public mediabooksUrl: String;
  public chatUrl: String;
  public profileUrl: String;
  public unreadMsgCount: any;
  public destroy$: any = new Subject<any>();
  public proUserRoles: any = PRO_USER_ROLES;
  public business: any;

  constructor(@Inject(PLATFORM_ID) private platformId,
              private store: Store<AppState>,
              private http: HttpClient,
              public router: Router,
              private route: ActivatedRoute,
              private _mainService: MainService,
              private spinner: NgxSpinnerService,
              private _auth: AuthService) {
  }

  ngOnInit() {
    this.loginData();
    this.getProUser();
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.searchStr = (params['search']) ? params['search'] : '';
      });
    document.body.addEventListener('click', () => this.showDropDown = this.showTrendingList = this.showSearchList = false);
  }

  async logout() {
    try {
      this.spinner.show();
      await this._auth.logout();
      this.spinner.hide();
      this.router.navigate(['/signin']);
    } catch (e) {
      console.error('HeaderComponent -> Logout ::: ', e);
    }
    this.showDropDown = false;
  }

  loginData() {
    this.store.select('loginUser')
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
        this.business = op.get(res, 'data.business');
        if (this.currentUser) {
          this.currentUser.name = `${this.currentUser.first_name} ${this.currentUser.last_name}`;
          this.getNodeBBSlug();
          this.showMoDropDwon = false;
          this.disscussion_link = `${environment.DISSCUSSION_LINK}` + '?ewologin=true';
          this.manageUrl = `${environment.DISSCUSSION_LINK}user/${this.currentUser.username}/topics`;
          this.mediabooksUrl = `${this.currentUser.username}/mediabooks`;

          this.profileUrl = `user/${this.currentUser.username}`;
          this.chatUrl = `${environment.chatURL}/${this.currentUser.username}/chats`;
          this.preUrl = `${environment.chatURL}/${this.currentUser.username}/settings`;
        }
      });
  }

  async getProUser() {
    await this._auth.getProUser();
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.business = op.get(res.proUser, 'business');
        }
      });
  }

  openMobileMenu() {
    this.isOpenMenu = !this.isOpenMenu;
    this._mainService.isMobileMenuOpen.emit({mobileMenu: this.isOpenMenu});
  }

  async getNodeBBSlug() {
    try {
      await this._mainService.getNodeBBSlug(this.currentUser.email, true);
    } catch (e) {
      console.log('HeaderComponent -> getNodeBBSlug :: ', e);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
