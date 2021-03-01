import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import * as op from 'object-path';

import {ConfigurationService} from '../../../../_services/configuration/configuration.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-pro-how-it-works',
  templateUrl: './pro-how-it-works.component.html',
  styleUrls: ['./pro-how-it-works.component.scss']
})
export class ProHowItWorksComponent implements OnInit, OnDestroy {

  public WP_STORIES_LINK = `${environment.WP_STORIES_LINK}`;
  public currentUser: any;
  public destroy$: any = new Subject<any>();
  public business: any;
  public loading = false;
  public dataArr: any = [];
  public index = 0;

  constructor(public sanitizer: DomSanitizer,
              private store: Store<any>,
              private configService: ConfigurationService) {
  }

  ngOnInit() {
    this.getLoginUser();
    this.getProUser();
    this.getMarketingPageArticle();
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  getProUser() {
    this.loading = true;
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.loading = false;
          this.business = op.get(res.proUser, 'business');
        } else {
          this.loading = false;
        }
      });
  }

  async getMarketingPageArticle() {
    this.dataArr = await this.configService.getMarketingPageArticle();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
