import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators/index';
import {Subject} from 'rxjs';
import * as op from 'object-path';

import {AppState} from '../../../app.state';


@Component({
  selector: 'app-account-banner',
  templateUrl: './account-banner.component.html',
  styleUrls: ['./account-banner.component.scss']
})
export class AccountBannerComponent implements OnInit, OnDestroy {

  @Input() isSignUp: any;
  public destroy$: any = new Subject<any>();
  public user: any;
  public business: any;
  public location: any;
  public locationId: any;

  constructor(private activatedRoute: ActivatedRoute,
              private store: Store<AppState>) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.locationId = op.get(params, 'locId');
        this.updateLocationData();
      });
  }

  ngOnInit() {
    this.getUserByUserName();
  }

  getUserByUserName() {
    try {
      this.store.select('pro')
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (res) => {
          this.user = op.get(res, 'proUser');
          this.business = op.get(this.user, 'business');
          this.updateLocationData();
        });
    } catch (e) {
      console.log('AccountBannerComponent -> getUserByUserName :: ', e);
    }
  }

  updateLocationData() {
    const bLocation: any = op.get(this.business, 'locations', []);
    const selectedLoc = bLocation.find((o: any) => {
      return this.locationId ? this.locationId === op.get(o, 'location._id') : o.is_default;
    });
    this.location = op.get(selectedLoc, 'location');
    if (this.location) {
      const address: string = op.get(this.location, 'address', '');
      const city: string = op.get(this.location, 'city', '');
      const state: string = op.get(this.location, 'state', '');
      const stateCode: string = op.get(this.location, 'st', '');
      const zip: string = op.get(this.location, 'zip', '');
      this.location.locFormat1 = [city, stateCode].filter((o) => o).join(', ').trim();
      this.location.locFormat2 = [address, city].filter((o) => o).join(', ').trim();
      this.location.locFormat3 = [stateCode, zip].filter((o) => o).join(', ').trim();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
