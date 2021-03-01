import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {MatDialog} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators/index';
import * as _ from 'lodash';
import * as op from 'object-path';

import {AppState} from '../../../app.state';
import {ProUserService} from '../../../_services/pro-user/pro-user.service';

@Component({
  selector: 'app-pros-search-result',
  templateUrl: './pros-search-result.component.html',
  styleUrls: ['./pros-search-result.component.scss']
})
export class ProsSearchResultComponent implements OnInit, OnDestroy {

  public loaded: any = false;
  public destroy$: any = new Subject<any>();
  public qp: any = {searchString: ''};
  public proData: any;
  public proMetaData: any;
  public carousel: any = [
    {path: 'assets/img/cover-img-gallery/1.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/2.jpg', isSelect: false},
    {path: 'assets/img/cover-img-gallery/3.jpg', isSelect: false}
  ];

  constructor(private store: Store<AppState>,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private proUserService: ProUserService) {

  }

  ngOnInit() {
    let searchStr = '';
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        searchStr = params['search'];
        if (searchStr !== this.qp.searchString && searchStr) {
          this.qp.searchString = searchStr;
        } else {
          this.qp.searchString = '';
        }
        this.proUsersData();
      });
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

  async proUsersData() {
    this.loaded = false;
    const queryParams: any = _.pickBy(this.qp, _.identity);
    if (!_.isEmpty(queryParams)) {
      const proData: any = await this.proUserService.findProviders(queryParams);
      this.proData = op.get(proData, 'data.0.data', []);
      this.proMetaData = op.get(proData, 'data.0.metadata.0');
    }
    this.loaded = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
