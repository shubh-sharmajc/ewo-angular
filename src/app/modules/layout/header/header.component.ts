import {HttpClient} from '@angular/common/http';
import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators/index';
import {isPlatformBrowser} from '@angular/common';
import * as _ from 'lodash';
import * as op from 'object-path';

import {environment} from '../../../../environments/environment';
import {AppState} from '../../../app.state';
import {MainService} from '../../../_services/main.service';
import {AuthService} from '../../../_services/auth/auth.service';
import {PRO_USER_ROLES} from '../../../constant';

declare var gtag: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public serverURL: any = environment.apiUrl;
  public currentUser: any;
  public WP_LINK = `${environment.WP_LINK}`;
  public WP_STORIES_LINK = `${environment.WP_STORIES_LINK}`;
  public notfication_link = `${environment.notificationURL}`;
  public disscussion_link = `${environment.DISSCUSSION_LINK}`;
  public preUrl: any;
  public searchStr: any = '';
  public searchPlh: any = '';
  public showSearchList = false;
  public showTrendingList = false;
  public trendingList = [];
  public searchList = [
    {'icon': 'helpicon', 'key': 'recent', 'name': 'Searches', 'result': []},
    {'icon': 'photoicon', 'key': 'photoicon', 'name': 'Photos', 'result': []},
    {'icon': 'bookicon', 'key': 'bookicon', 'name': 'Stories', 'result': []},
    {'icon': 'prosicon', 'key': 'prosicon', 'name': 'Pros', 'result': []},
    {'icon': 'adviceicon', 'key': 'adviceicon', 'name': 'Conversations', 'result': []},
    {'icon': 'usericon', 'key': 'usericon', 'name': 'Users', 'result': []},
    {'icon': 'helpicon', 'key': 'helpicon', 'name': 'Help', 'result': []}];
  public searchResult: any = [];
  public searchPhotoResult: any = [];
  public searchUsersResult: any = [];
  public pHStyle = {'left': '15.4%', 'color': 'rgb(204, 204, 204)', 'is_display': false, 'phText': 'Stories'};
  public hoverContent = 'photoicon';
  public isOpenMenu = false;
  public showStories = false;
  public showDropDown = false;
  public showMoDropDwon = false;
  public showNoti = false;
  public showMoNoti = false;
  public categories: any;
  public manageUrl: String;
  public mediabooksUrl: String;
  public chatUrl: String;
  public profileUrl: String;
  public unreadMsgCount: any;
  public unreadNoteCount: any;
  public is_navigated: any;
  public destroy$: any = new Subject<any>();
  public proUserRoles: any = PRO_USER_ROLES;
  public business: any;
  public showMenu = true;

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
    this.storyCategory();
    this.loginData();
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
          this.getMsgCount();
          this.getNotificationCount();
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

  commonSearch(event) {
    if (this.searchStr.length > 0) {
      this.searchPlh = this.searchStr + ' in ' + this.pHStyle.phText;
    } else {
      this.searchPlh = '';
    }
    if (event.type === 'click' && this.searchStr === '') {
      this.searchTrendingRecord();
    }
    if (event && event.keyCode == 13) {
      this.showTrendingList = false;
      this.searchData(this.searchStr, 'photoicon', 'Photos');
    } else {
      if (this.searchStr && this.searchStr.length >= 3) {
        this.showTrendingList = false;
        this.showSearchList = true;
        this.pHStyle.is_display = true;
        this.pHStyle.left = (this.searchStr.length > 3) ? ((this.searchStr.length * 1.42) + 10) + '%' : '15.4%';
        this.searchStoryData();
        this.searchPhotosData();
        this.searchConversation();
        this.searchPros();
        if (this._auth.getToken()) {
          this.searchUsersData();
        }
      } else {
        this.showTrendingList = false;
        this.pHStyle.is_display = false;
        this.pHStyle.left = (this.searchStr && this.searchStr.length > 3) ? (this.searchStr.length * 2) + '%' : '15.4%';
        this.searchList.map(function (rec) {
          return {result: []};
        });
        this.showSearchList = false;
      }
    }
  }

  searchPros() {
    this.http.post<any>(`${environment.apiUrl}/user/find-providers`, {searchString: this.searchStr}).subscribe(resp => {
      if (resp.status === 'success') {
        const index = this.searchList.findIndex(x => x.key === 'prosicon');
        this.searchList[index].result = resp.data[0].data;
      } else {
        const index = this.searchList.findIndex(x => x.key === 'prosicon');
        this.searchList[index].result = [];
      }
    });
  }

  searchStoryData() {
    this.http.get<any>(`${environment.WP_API_URL}?type=search&keywordsearch=` + this.searchStr).subscribe((resp) => {
      if (resp.response_code === '200') {
        const index = this.searchList.findIndex(x => x.key == 'bookicon');
        this.searchList[index].result = resp.search_result;
      } else {
        const index = this.searchList.findIndex(x => x.key == 'bookicon');
        this.searchList[index].result = [];
      }
    });
  }

  searchConversation() {
    this._mainService.searchConversation(this.searchStr)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res && res.posts) {
          const topics = [];
          res.posts.forEach(element => {
            if (element.topic && element.topic.title && topics.length < 3) {
              topics.push({search_key: element.topic.title, slug: element.topic.slug});
            }
          });
          const index = this.searchList.findIndex(x => x.key == 'adviceicon');
          this.searchList[index].result = topics;
        }
      });
  }

  searchPhotosData() {
    this.http.get<any>(`${environment.apiUrl}/image/api/search?keyword=` + this.searchStr).subscribe((resp) => {
      if (resp.status === 'success') {
        this.searchPhotoResult = resp.entities;
        const index = this.searchList.findIndex(x => x.key == 'photoicon');
        this.searchList[index].result = resp.entities.photos;
        const index1 = this.searchList.findIndex(x => x.key == 'recent');
        this.searchList[index1].result = resp.entities.recent_search;
      } else {
        const index = this.searchList.findIndex(x => x.key == 'photoicon');
        this.searchList[index].result = [];
      }
    });
  }

  searchUsersData() {
    this._mainService.findUsers({searchString: this.searchStr, limit: 5}).subscribe((resp) => {
      if (resp.status == 'success') {
        this.searchUsersResult = resp.data.docs;
        const index = this.searchList.findIndex(x => x.key == 'usericon');
        this.searchList[index].result = resp.data.docs;
      } else {
        const index = this.searchList.findIndex(x => x.key == 'usericon');
        this.searchList[index].result = [];
      }
    });
  }

  searchData(str: any, key, name = '', type = '') {
    this.showTrendingList = false;
    if (type === 'save') {
      const data = {'search_str': str, 'category': name};
      this._mainService.saveSearchLog(data);
    }

    setTimeout(() => {
      if (key === 'photoicon' || (key === 'Photos' && name === 'Photos') || key === 'Photos') {
        this.router.navigate(['/photos'], {queryParams: {search: str}});
        this.is_navigated = true;
        this.showSearchList = false;
        this.pHStyle.is_display = false;
      } else if (key === 'usericon' || (key === 'Users' && name === 'Users') || key === 'Users') {
        this.router.navigate(['/users'], {queryParams: {search: str}});
        this.showSearchList = false;
        this.pHStyle.is_display = false;
      } else if (key === 'prosicon') {
        this.router.navigate(['/pros-search'], {queryParams: {search: this.searchStr}});
        this.showSearchList = false;
        this.pHStyle.is_display = false;
      } else if (key === 'adviceicon' || (key === 'Conversations' && name === 'Conversations')) {
        window.location.href = `${environment.DISSCUSSION_LINK}/search?term=${str}&in=titlesposts`;
      } else {
        str = str.replace(/ /gi, '+').replace(/&/gi, '%26');
        window.location.href = `${environment.WP_LINK}?s=${str}`;
      }
    }, 500);
  }

  searchTrendingRecord() {
    this._mainService.searchTrendingRecord()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res && res.entities.trending_search) {
          this.showTrendingList = true;
          this.trendingList = op.get(res, 'entities.trending_search', []).map((o: any) => {
            o.icon = op.get(this.searchList.find((d) => d.name === o.category), 'icon');
            return o;
          });
        }
      });
  }

  showActive(item) {
    this.hoverContent = item.key;
    this.is_navigated = false;
    this.pHStyle.phText = item.name;
    if (this.searchStr.length > 0) {
      this.searchPlh = this.searchStr + ' in ' + this.pHStyle.phText;
    } else {
      this.searchPlh = '';
    }
  }

  onClickedOutside(event) {
    this.showTrendingList = false;
    this.pHStyle.is_display = false;
    this.pHStyle.left = (this.searchStr.length > 3) ? (this.searchStr.length * 2) + '%' : '15.4%';
    this.searchList.map(function (rec) {
      return {result: []};
    });
    this.showSearchList = false;
    this.showMenu = true;
  }

  openMobileMenu() {
    this.isOpenMenu = !this.isOpenMenu;
    this._mainService.isMobileMenuOpen.emit({mobileMenu: this.isOpenMenu});
  }

  storyCategory() {
    if (isPlatformBrowser(this.platformId)) {
      this._mainService.getStoryCategory()
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.categories = res;
        });
    }
  }

  async getNodeBBSlug() {
    try {
      await this._mainService.getNodeBBSlug(this.currentUser.email, true);
    } catch (e) {
      console.log('HeaderComponent -> getNodeBBSlug :: ', e);
    }
  }

  getMsgCount() {
    this._mainService.getMessageCount(this.currentUser.email).subscribe(res => {
      if (res && res.result) {
        this.unreadMsgCount = res.result.unreadMsgCount;
      }
    });
  }

  getNotificationCount() {
    this._mainService.getNotificationCount(this.currentUser.email).subscribe(res => {
      if (res && res.result) {
        this.unreadNoteCount = res.result.unreadNotifCount;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
  hideMenu() {
    this.showMenu = false;
    this.showTrendingList = true;
    setTimeout(() => {
      document.getElementById('searchResult').focus();
      document.getElementById('searchResult').click();
    });
  }
  closeOverlay(event){
    if(event.target.className == 'overlay show') {
      this.showMenu = true;
      this.showTrendingList = false;
    }
  }
}
