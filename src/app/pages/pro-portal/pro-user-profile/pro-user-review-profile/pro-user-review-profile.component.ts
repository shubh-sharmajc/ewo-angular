import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/internal/operators';
import {ScrollEvent} from 'ngx-scroll-event';
import * as op from 'object-path';

import {AuthService} from '../../../../_services/auth/auth.service';
import {FlagReviewService} from '../../../../modal/pro-modal/flag-review/flag-review.service';
import {ProReviewsService} from '../../../../_services/pro-reviews/pro-reviews.service';
import {PRO_USER_ROLES} from '../../../../constant';

@Component({
  selector: 'app-pro-user-view-profile',
  templateUrl: './pro-user-review-profile.component.html',
  styleUrls: ['./pro-user-review-profile.component.scss']
})
export class ProUserReviewProfileComponent implements OnInit, OnDestroy {

  public business: any;
  public proUser: any;
  public username: any;
  public user_name: any;
  public currentUser: any;
  public user: any;
  public sortArr = [{name: 'Date', value: 1}, {name: 'Ratings', value: 2}];
  public reviewParam: any = {s: 1, p: 1};
  public reviews: any;
  public destroy$: any = new Subject<any>();
  public searchInput: any;
  public searchOutput: any = new Subject<string>();
  public proUserRoles: any = PRO_USER_ROLES;
  public keywordPercentage: any;
  public reviewPercentage: any;
  public avgRatings: any = 0;
  public totRatings: any = 0;
  public selectedLoc: any;
  public locationId: any;
  public location: any;
  public isScrollChange: any = false;

  constructor(private store: Store<any>,
              private auth: AuthService,
              private activatedRoute: ActivatedRoute,
              private flagReviewDialogService: FlagReviewService,
              private proReviewsService: ProReviewsService) {
    this.activatedRoute.params.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.username = params.username;
      });
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.locationId = op.get(params, 'locId');
        if (this.business) {
          this.updateLocationData();
        }
      });
    this.searchOutput.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.reviewParam.f = value;
        } else {
          delete this.reviewParam.f;
        }
        this.listReviews();
      });
  }

  ngOnInit() {
    this.getUserByUserName();
    this.getProUser();
    this.reviewOverview();
  }

  getUserByUserName() {
    try {
      this.store.select('user')
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res && res.user && res.user.data) {
            this.user = res.user.data;
            this.user_name = `${this.user.first_name} ${this.user.last_name}`;
          }
        });
    } catch (e) {
      console.log('ProUserProfileComponent -> getUserByUserName :: ', e);
    }
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.proUser = res.proUser;
          this.business = op.get(res.proUser, 'business');
          this.updateLocationData();
        }
      });
  }

  updateLocationData() {
    const bLocation: any = op.get(this.business, 'locations', []);
    this.selectedLoc = bLocation.find((o: any) => {
      return this.locationId ? this.locationId === op.get(o, 'location._id') : o.is_default;
    });
    this.location = op.get(this.selectedLoc, 'location');
    this.listReviews();
  }

  async scrollHandler($event: ScrollEvent) {
    if ($event.isReachingBottom && !this.isScrollChange) {
      this.isScrollChange = true;
      this.reviewParam.p++;
      const resp: any = await this.proReviewsService.listReviews(op.get(this.business, '_id'), op.get(this.location, '_id'), this.reviewParam);
      if (resp && resp.data && !resp.data.length) {
        this.isScrollChange = true;
      } else {
        this.isScrollChange = false;
      }
    }
  }

  async listReviews() {
    this.isScrollChange = false;
    this.reviewParam.p = 1;
    await this.proReviewsService.listReviews(op.get(this.business, '_id'), op.get(this.location, '_id'), this.reviewParam, true);
    this.store.select('reviews')
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (res) => {
        if (op.get(res, 'reviews')) {
          this.reviews = op.get(res, 'reviews');
        }
      });
  }

  async onCommentSubmit(review: any) {
    const data = {comment: review.comment, business: op.get(this.business, '_id'), location: op.get(this.location, '_id')};
    if (review.comment) {
      const res: any = await this.proReviewsService.addReviewComment(op.get(review, '_id'), data);
      review.submitted = false;
      review.comment = '';
      review.comments = op.get(res, 'data.comments');
    }
  }

  flagReview(reviewID) {
    this.flagReviewDialogService.openFlagReviewModal(reviewID);
  }

  flagComment(reviewID, commentID) {
    this.flagReviewDialogService.openFlagReviewModal(reviewID, commentID);
  }

  reviewOverview() {
    this.store.select('reviews')
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (res) => {
        const overview: any = op.get(res, 'overview');
        if (overview) {
          const keywordPercentage: any = op.get(overview, '0.keywordPercentage', []);
          const kpOrder: any = ['Knowledgeable', 'Punctual', 'Courteous & professional', 'Office & staff'];
          this.keywordPercentage = Object.keys(keywordPercentage).sort((a: any, b: any) => kpOrder[b] - kpOrder[a]).map((key: any) => {
            return {name: key, value: keywordPercentage[key]};
          });
          const reviewPercentage: any = op.get(overview, '0.reviewPercentage', []);
          this.reviewPercentage = Object.keys(reviewPercentage).sort((a: any, b: any) => b - a).map((key: any) => {
            return {name: key, value: reviewPercentage[key]};
          });
          this.avgRatings = op.get(overview, '0.avgRatings', 0);
          this.totRatings = op.get(overview, '0.total', 0);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
