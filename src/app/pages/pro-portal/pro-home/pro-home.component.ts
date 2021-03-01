import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators/index';
import * as _ from 'lodash';
import * as op from 'object-path';

@Component({
  selector: 'app-pro-home',
  templateUrl: './pro-home.component.html',
  styleUrls: ['./pro-home.component.scss']
})
export class ProHomeComponent implements OnInit, OnDestroy {

  public currentUser: any;
  public destroy$: any = new Subject<any>();
  public proUser: any;
  public business: any;

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
    this.getLoginUser();
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
        this.business = op.get(res, 'data.business');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
