import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Location} from '@angular/common';
import {takeUntil} from 'rxjs/operators/index';
import {Subject} from 'rxjs';
import * as op from 'object-path';

import {AuthService} from '../../../../_services/auth/auth.service';
import {ProUserService} from '../../../../_services/pro-user/pro-user.service';
import {AppState} from '../../../../app.state';
import {PRO_USER_ROLES} from '../../../../constant';

@Component({
  selector: 'app-pro-sign-up',
  templateUrl: './pro-user-account.component.html',
  styleUrls: ['./pro-user-account.component.scss']
})
export class ProUserAccountComponent implements OnInit, OnDestroy {

  public tabs: any = [
    {
      name: 'Account Home', value: 'account-home',
      tabs: [
        {name: 'Edit profile', value: 'view-profile', parentTabVal: 'account-home'},
        {name: 'Billing & Payments', value: 'billing-and-payments', parentTabVal: 'account-home'},
        {name: 'Manage account security', value: 'account-security', parentTabVal: 'account-home'},
        {name: 'Add locations (Premium feature)', value: 'add-locations', parentTabVal: 'account-home'},
      ]
    },
    {
      name: 'Customize profile forms', value: 'profile',
      tabs: [
        {name: 'Basic registration', value: 'basic-registration', parentTabVal: 'profile'},
        {name: 'Business profile', value: 'business-profile', parentTabVal: 'profile'},
        {name: 'Testimonials', value: 'testimonials', parentTabVal: 'profile'},
        {name: 'Recognitions', value: 'recognitions', parentTabVal: 'profile'},
        {name: 'Reviews', value: 'reviews', parentTabVal: 'profile'},
        {name: 'Request reviews', value: 'request-reviews', parentTabVal: 'profile'},
        {name: 'Staff bios (Premium feature)', value: 'staff-bios', parentTabVal: 'profile'},
        {name: 'Social links', value: 'social-links', parentTabVal: 'profile'}
      ]
    },
    {name: 'Add new services (ON HOLD)', value: 'add-new-services'},
    {name: 'Contact us (ON HOLD)', value: 'contact-us'}
  ];
  public tab: any = this.tabs[0];
  public paramTabValue: any;
  public business: any;
  public bLocation: any;
  public selectedLoc: any;
  public locationId: any;
  public proUser: any;
  public destroy$: any = new Subject<any>();

  constructor(private router: Router,
              private store: Store<AppState>,
              private activatedRoute: ActivatedRoute,
              private auth: AuthService,
              private proUserService: ProUserService,
              private location: Location) {
    this.activatedRoute.params.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.paramTabValue = op.get(params, 'tab', 'account-home');
      });
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.locationId = op.get(params, 'locId');
        this.updateLocationData();
      });
  }

  ngOnInit() {
    this.getProUserData();
  }

  private updateTabsData() {
    const role: any = op.get(this.proUser, 'role');
    this.tabs = this.tabs.map((pTab: any) => {
      pTab.hide = false;
      pTab.disable = false;
      pTab.active = this.paramTabValue === pTab.value;
      if (pTab.active) {
        this.tab = pTab;
      }
      if (op.get(pTab, 'tabs')) {
        pTab.tabs = pTab.tabs.map((cTab: any) => {
          cTab.hide = false;
          cTab.disable = false;
          cTab.active = this.paramTabValue === cTab.value;
          if (cTab.active) {
            pTab.active = pTab.value === cTab.parentTabVal;
            this.tab = cTab;
          }
          if (this.paramTabValue !== 'request-reviews' && cTab.value === 'request-reviews') {
            cTab.hide = true;
          } else if (this.paramTabValue === 'request-reviews' && cTab.value === 'reviews') {
            cTab.hide = true;
          }
          if (cTab.value === 'add-locations' || cTab.value === 'staff-bios') {
            cTab.disable = !(PRO_USER_ROLES.filter((o) => o === 'pro-premium').indexOf(role) > -1);
          }
          return cTab;
        });
      }
      return pTab;
    });
  }

  public async getProUser() {
    await this.auth.getProUser();
  }

  getProUserData() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.proUser = res.proUser;
          this.business = op.get(res.proUser, 'business');
          this.updateTabsData();
          this.updateLocationData();
        }
      });
  }

  public locationChange() {
    const locId: any = op.get(this.selectedLoc, 'location._id');
    this.router.navigate([`/pro/account/${this.paramTabValue}`], {queryParams: {locId}});
  }

  updateLocationData() {
    this.bLocation = op.get(this.business, 'locations', []);
    this.selectedLoc = this.bLocation.find((o: any) => {
      return this.locationId ? this.locationId === op.get(o, 'location._id') : o.is_default;
    });
  }

  public changeTab(tab) {
    this.paramTabValue = tab.value;
    this.updateRoute();
    this.updateTabsData();
  }

  public updateRoute() {
    if (this.paramTabValue === 'view-profile') {
      this.router.navigate([`/pro/user/${this.proUser.username}`]);
    } else if (this.paramTabValue === 'reviews') {
      this.router.navigate([`/pro/user/${this.proUser.username}/review`]);
    } else {
      const URL: any = `/pro/account/${this.paramTabValue}`;
      const urlTree: any = this.router.createUrlTree([URL], {queryParams: {locId: this.locationId}});
      this.location.replaceState(urlTree.toString());
    }
  }

  async updateProUser(data) {
    await this.proUserService.updateProUser(this.proUser._id, op.get(this.selectedLoc, 'location._id'), data);
  }

  async next(data) {
    await this.updateProUser(data);
    await this.getProUser();
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
