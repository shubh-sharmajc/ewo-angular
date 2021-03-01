import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators/index';
import {ScrollEvent} from 'ngx-scroll-event';
import * as op from 'object-path';
import * as _ from 'lodash';

import {ProUserService} from '../../../../_services/pro-user/pro-user.service';
import {ContactUsService} from '../../../../modal/pro-modal/contact-us/contact-us.service';
import {AppState} from '../../../../app.state';
import {ConfigurationService} from '../../../../_services/configuration/configuration.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { ProviderFilterComponent } from '../provider-filter/provider-filter.component';

@Component({
  selector: 'app-find-pros-details',
  templateUrl: './find-pros-details.component.html',
  styleUrls: ['./find-pros-details.component.scss']
})
export class FindProsDetailsComponent implements OnInit, OnDestroy {

  public oPath: any = op;
  public destroy$: any = new Subject<any>();
  public locationChange: any = new Subject<any>();
  public searchStrChange: any = new Subject<any>();
  public locations: any = [];
  public priceRange: any = [
    {name: '$$$:  Variety of services, best  quality', value: 3},
    {name: '$$:  Mid-priced services, wider range', value: 2},
    {name: '$:Affordable, focused services', value: 1},
    {name: 'Any price', value: 0}];
  public ratings: any = [{name: 'Ratings', value: 5}, {name: 'Ratings', value: 4}, {name: 'Ratings', value: 3},
    {name: 'Ratings', value: 2}, {name: 'Ratings', value: 1}];
  public insurance: any = [{name: 'Any insurance'}];
  public carousel: any = [
    {path: 'assets/img/cover-img-gallery/1.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/2.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/3.jpg', isSelect: false}
  ];
  public proData: any;
  public proMetaData: any;
  public qp: any = {searchLocation: '', searchString: '', rating: null, page: 1};
  public proCategories: any = [];
  public breadcrumb: any;
  public industryCategory;
  public searchTitle: any = 'All Pros';
  public isScrollChange: any = false;
  modal = false;
  public currentUser: any;
  constructor(public router: Router,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private proUserService: ProUserService,
              private store: Store<AppState>,
              private configurationService: ConfigurationService,
              private contactUsDialogService: ContactUsService) {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.qp.category = op.get(params, 'category');
        this.qp.searchLocation = op.get(params, 'zipcode');
        this.qp.searchString = op.get(params, 'searchString');
        this.qp.price_range = op.get(params, 'price_range');
        this.qp.rating = op.get(params, 'rating') ? parseInt(op.get(params, 'rating')) : null;
        this.industryCategory = op.get(params, 'industryCategory');
      });
  }
  openDialog() {
    const dialogRef = this.dialog.open(ProviderFilterComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.locationChangeEvent();
    this.searchStrEvent();
    this.getProCategories();
    this.getLocations();
    this.makeBreadcrumb();
    this.getPros();
    this.loginData();
  }

  loginData() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  getPriceRange(value: any) {
    return this.priceRange.find((o: any) => o.value === value);
  }

  getCategory(category: any) {
    return this.proCategories.find((o: any) => o._id === category);
  }

  getLocInfo(loc: any) {
    const obj: any = {address: [], address1: []};
    const ifAvailable: any = (mainKey, subKey) => {
      if (op.get(loc, subKey)) {
        obj[mainKey].push(op.get(loc, subKey));
      }
    };
    if (op.get(loc, 'address')) {
      obj.address.push(op.get(loc, 'address'));
      ifAvailable('address', 'city');
      ifAvailable('address', 'state');
      ifAvailable('address', 'country');
      ifAvailable('address', 'zip');
    }
    if (op.get(loc, 'address1')) {
      obj.address1.push(op.get(loc, 'address1'));
      ifAvailable('address1', 'city');
      ifAvailable('address1', 'state');
      ifAvailable('address1', 'country');
      ifAvailable('address1', 'zip');
    }
    obj.address = obj.address.join(', ');
    obj.address1 = obj.address1.join(', ');
    return obj;
  }

  makeSearchTitle() {
    this.searchTitle = 'All Pros';
    const category: any = op.get(this.qp, 'category');
    const location: any = op.get(this.qp, 'location');
    const searchString: any = op.get(this.qp, 'searchString');
    if (category && location) {
      const getCat: any = this.getCategory(category);
      const city: any = op.get(location, 'city');
      if (getCat && city) {
        this.searchTitle = `${getCat.name} in ${city}`;
      }
    } else if (category) {
      const getCat: any = this.getCategory(category);
      if (getCat) {
        this.searchTitle = getCat.name;
      }
    } else if (location) {
      const loc: any = [];
      const city: any = op.get(location, 'city');
      const st: any = op.get(location, 'st');
      const zip: any = op.get(location, 'zip');
      if (city) {
        loc.push(city);
      }
      if (st && zip) {
        loc.push(`${st} ${zip}`);
      }
      this.searchTitle = loc.join(', ');
    } else if (searchString) {
      this.searchTitle = searchString;
    }
  }

  makeBreadcrumb() {
    this.breadcrumb = ['Personal Wellness'];
    if (this.industryCategory) {
      this.breadcrumb.push(this.industryCategory);
    }
    if (op.get(this.qp, 'category')) {
      const getCat: any = this.proCategories.find((o: any) => o._id === this.qp.category);
      if (getCat) {
        this.breadcrumb.push(getCat.name);
      }
    }
    if (op.get(this.qp, 'location')) {
      if (op.get(this.qp, 'location.city')) {
        this.breadcrumb.push(op.get(this.qp, 'location.city'));
      }
      if (op.get(this.qp, 'location.zip')) {
        this.breadcrumb.push(op.get(this.qp, 'location.zip'));
      }
    }
    this.makeSearchTitle();
  }

  async getProCategories() {
    try {
      this.proCategories = await this.configurationService.getProCategories();
      this.makeBreadcrumb();
    } catch (e) {
      console.error('FindProsDetailsComponent -> getProCategories', e);
    }
  }

  public searchStrEvent() {
    this.searchStrChange.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(() => {
        this.findProviders();
      });
  }

  public locationChangeEvent() {
    this.locationChange.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.qp.searchLocation = value;
        this.getLocations();
      });
  }

  async getLocations() {
    try {
      this.locations = await this.proUserService.getLocations({searchStr: this.qp.searchLocation});
      if (this.locations && this.locations.length === 1) {
        this.qp.location = op.get(this.locations, '0');
        this.makeBreadcrumb();
      }
      this.findProviders();
    } catch (e) {
      this.locations = [];
      console.error('FindProsDetailsComponent -> getLocations', e);
    }
  }

  updateActivatedRoute(queryParams: any) {
    delete queryParams.page;
    if (this.industryCategory) {
      queryParams.industryCategory = this.industryCategory;
    }
    const url: any = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams});
    this.router.navigateByUrl(url.toString());
  }

  getPros() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (res) => {
        if (op.get(res, 'pros')) {
          this.proData = op.get(res, 'pros');
        }
      });
  }

  async scrollHandler($event: ScrollEvent) {
    if ($event.isReachingBottom && !this.isScrollChange) {
      this.isScrollChange = true;
      this.qp.page++;
      const resp: any = await this.proUserService.findProviders(this.getQP());
      const data: any = op.get(resp, 'data.0.data', []);
      if (!data.length) {
        this.isScrollChange = true;
      } else {
        this.isScrollChange = false;
      }
    }
  }

  private getQP() {
    this.qp.city = op.get(this.qp, 'location.city');
    this.qp.state = op.get(this.qp, 'location.state');
    this.qp.zip = op.get(this.qp, 'location.zip');
    this.makeBreadcrumb();

    const queryParams: any = _.pickBy(this.qp, _.identity);
    delete queryParams.location;
    delete queryParams.searchLocation;
    return queryParams;
  }

  async findProviders() {
    try {
      this.isScrollChange = false;
      this.qp.page = 1;
      const proData: any = await this.proUserService.findProviders(this.getQP(), true);
      this.proData = op.get(proData, 'data.0.data', []);
      this.proMetaData = op.get(proData, 'data.0.metadata.0');
      this.updateActivatedRoute(this.getQP());
    } catch (e) {
      console.error('FindProsDetailsComponent -> findProviders', e);
    }
  }

  public removeQP(key: string) {
    delete this.qp[key];
    this.findProviders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

  contact() {
    this.contactUsDialogService.openContactUsModal();
  }
}
