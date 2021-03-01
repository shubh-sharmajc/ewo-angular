import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators/index';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import * as op from 'object-path';

import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../_services/user/user.service';
import {WriteAReviewService} from '../../../../modal/pro-modal/write-a-review/write-a-review.service';
import {ProReviewsService} from '../../../../_services/pro-reviews/pro-reviews.service';
import {FlagReviewService} from '../../../../modal/pro-modal/flag-review/flag-review.service';
import {ScrollEvent} from 'ngx-scroll-event';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.scss']
})
export class MyReviewsComponent implements OnInit, OnDestroy {

  public destroy$: any = new Subject<any>();
  public currentUser: any;
  public searchInput: any;
  public searchOutput: any = new Subject<string>();
  public reviews: any;
  public profileUrl: any;
  public sortArr = [{name: 'Date', value: 1}, {name: 'Ratings', value: 2}];
  public reviewParam: any = {s: 1, p: 1};
  public notfication_link = `${environment.notificationURL}`;
  public isScrollChange: any = false;

  constructor(private store: Store<any>,
              private userService: UserService,
              private writeAReviewDialogService: WriteAReviewService,
              private proReviewsService: ProReviewsService,
              private flagReviewDialogService: FlagReviewService) {
    this.searchOutput.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.reviewParam.f = value;
        } else {
          delete this.reviewParam.f;
        }
        this.getMyReviews();
      });
  }

  ngOnInit() {
    this.getLoginUser();
    this.getMyReviews();
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
        if (this.currentUser) {
          this.profileUrl = `${environment.DISSCUSSION_LINK}user/${res.data.username}`;
        }
        if (op.get(res, 'myReviews')) {
          this.reviews = op.get(res, 'myReviews');
        }
      });
  }

  async scrollHandler($event: ScrollEvent) {
    if ($event.isReachingBottom && !this.isScrollChange) {
      this.isScrollChange = true;
      this.reviewParam.p++;
      const resp: any = await this.userService.getMyReviews(op.get(this.currentUser, '_id'), this.reviewParam);
      if (resp && resp.data && !resp.data.length) {
        this.isScrollChange = true;
      } else {
        this.isScrollChange = false;
      }
    }
  }

  async getMyReviews() {
    this.isScrollChange = false;
    this.reviewParam.p = 1;
    await this.userService.getMyReviews(op.get(this.currentUser, '_id'), this.reviewParam, true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

  async onCommentSubmit(review: any) {
    const data = {comment: review.comment};
    if (review.comment) {
      const res: any = await this.proReviewsService.addReviewComment(op.get(review, '_id'), data);
      review.submitted = false;
      review.comment = '';
      review.comments = op.get(res, 'data.comments');
    }
  }

  flagComment(reviewID, commentID) {
    this.flagReviewDialogService.openFlagReviewModal(reviewID, commentID);
  }

  editMyReviews(review) {
    this.writeAReviewDialogService.openWriteAReviewModal(review)
      .then(() => {
        this.getMyReviews();
      });
  }

}
