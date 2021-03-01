import {Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators/index';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import * as op from 'object-path';

import {ProReviewsService} from '../../../_services/pro-reviews/pro-reviews.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {SpaceValidator} from '../../../constant';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-write-a-review',
  templateUrl: './write-a-review.component.html',
  styleUrls: ['./write-a-review.component.scss']
})
export class WriteAReviewComponent implements OnInit, OnDestroy {
  public title: string;
  public review: any;
  public writeAReviewForm: FormGroup;
  public data: any[] = [];
  public wrSubmitted: any;
  public reviews: any;
  public max: any = 5;
  public keywords: any[] = ['Knowledgeable', 'Punctual', 'Courteous & professional', 'Office & staff'];
  public destroy$: any = new Subject<any>();
  public business: any;
  public location: any;
  public onClose: Subject<any> = new Subject<any>();
  public locationId: any;

  constructor(private activatedRoute: ActivatedRoute,
              public bsModalRef: BsModalRef,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private store: Store<any>,
              private proReviewsService: ProReviewsService) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.locationId = op.get(params, 'locId');
      });
    this.createForm();
  }

  ngOnInit() {
    this.getProUser();
    if (this.review) {
      this.updateForm();
    }
  }

  createForm() {
    this.writeAReviewForm = this.formBuilder.group({
      details: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      title: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      keywords: new FormArray(this.keywords.map((o) => new FormControl(false))),
      rate: ['']
    });
  }

  get keywordsCtrl(): FormArray {
    return this.writeAReviewForm.get('keywords') as FormArray;
  }

  get f() {
    return this.writeAReviewForm.controls;
  }

  getKeywords() {
    return this.writeAReviewForm.value.keywords.map((v, i) => v ? this.keywords[i] : null).filter(v => v !== null);
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.business = op.get(res.proUser, 'business');
          this.location = op.get(op.get(this.business, 'locations', []).find((o: any) => {
            return this.locationId ? this.locationId === op.get(o, 'location._id') : o.is_default;
          }), 'location');
        }
      });
  }

  async writeAReviewSubmit() {
    if (!this.wrSubmitted) {
      this.wrSubmitted = true;
    }

    // stop here if form is invalid
    if (this.writeAReviewForm.invalid) {
      return;
    }
    const data = this.writeAReviewForm.getRawValue();
    data.ratings = data.rate;
    data.keywords = this.getKeywords();
    data.business = op.get(this.business, '_id');
    data.location = op.get(this.location, '_id');
    if (data.rate) {
      delete data.rate;
    }
    this.spinner.show();
    if (this.review && this.review._id) {
      await this.proReviewsService.editReviews(this.review._id, data);
    } else {
      await this.proReviewsService.addReviews(data);
    }
    this.spinner.hide();
    this.bsModalRef.hide();
    this.onClose.next(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

  updateForm() {
    const details: any = this.review && this.review.details ? this.review.details : '';
    const title: any = this.review && this.review.title ? this.review.title : '';
    const rate: any = this.review && this.review.ratings ? this.review.ratings : '';
    const keywords: any = this.review && this.review.keywords ? this.review.keywords : '';
    this.writeAReviewForm.patchValue({details, title, rate, keywords});
  }
}
