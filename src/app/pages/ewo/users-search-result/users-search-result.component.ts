import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';

import {AppState} from '../../../app.state';
import {MainService} from '../../../_services/main.service';
import {PRO_USER_ROLES} from '../../../constant';

@Component({
  selector: 'app-users-search-result',
  templateUrl: './users-search-result.component.html',
  styleUrls: ['./users-search-result.component.scss']
})
export class UsersSearchResultComponent implements OnInit {

  public searchStr = '';
  public usersList: any = [];
  public usersSearchData: any = {};
  public sub_currentUser: Subscription;
  public currentUser: any;
  public loaded: any = false;
  public proUserRoles: any = PRO_USER_ROLES;

  constructor(private _sanitizer: DomSanitizer,
              private store: Store<AppState>,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private _mainService: MainService) {

  }

  ngOnInit() {
    this.loginData();
    let searchStr = '';
    this.route.queryParams.subscribe(params => {
      searchStr = params['search'];
      if (searchStr !== this.searchStr && searchStr) {
        this.searchStr = searchStr;
      } else {
        this.searchStr = '';
      }
      this.usersData();
    });
  }

  loginData() {
    this.sub_currentUser = this.store.select('loginUser')
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  pagination(page: any = 1) {
    this.searchStr = '';
    this.usersData(page);
  }

  usersData(page: any = 1) {
    const data = {
      searchString: this.searchStr,
      page: page
    };
    this.loaded = false;
    this._mainService.findUsers(data)
      .subscribe((res) => {
        if (_.isObject(res) && _.isObject(res.data) && _.isArray(res.data.docs)) {
          this.usersSearchData = res.data;
          this.usersList = res.data.docs;
        }
        this.loaded = true;
      }, () => {
        this.loaded = true;
      });
  }

  public sanitizeImage(image: string) {
    return this._sanitizer.bypassSecurityTrustStyle(`url('${image}')`);
  }

}
