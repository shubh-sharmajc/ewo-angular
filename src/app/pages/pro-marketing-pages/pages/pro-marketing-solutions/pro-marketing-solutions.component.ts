import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import * as op from 'object-path';

@Component({
  selector: 'app-pro-marketing-solutions',
  templateUrl: './pro-marketing-solutions.component.html',
  styleUrls: ['./pro-marketing-solutions.component.scss']
})
export class ProMarketingSolutionsComponent implements OnInit, OnDestroy {

  public currentUser: any;
  public destroy$: any = new Subject<any>();
  public business: any;
  public loading = false;
  public listingData = [
    {
      subtitle: 'make your business more visible',
      title: 'Reach more clients in local markets',
      desc: 'Our services help you connect and build professional relationships with local clients looking for your services',
      feature: true,
      name: 'Name',
      image: '/assets/img/cover-img-gallery/1.jpg'
    },
    {
      subtitle: 'Showcase your experience and services',
      title: 'Build credibility and trust',
      desc: 'Highlight your background, staff credentials, customer testimonials and more using text and media.',
      image: '/assets/img/cover-img-gallery/2.jpg'
    },
    {
      subtitle: 'Mingle with potential customers',
      title: 'Build a reputation and grow your business',
      desc: 'Connect with potential clients by answering preliminary questions, sharing resources',
      image: '/assets/img/cover-img-gallery/3.jpg'
    },
    {
      subtitle: 'Mingle with potential customers',
      title: 'Build a reputation and grow your business',
      desc: 'Connect with potential clients by answering preliminary questions, sharing resources',
      image: '/assets/img/cover-img-gallery/4.jpg'
    }
  ];

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
    this.getLoginUser();
    this.getProUser();
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
