import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProUserService} from '../../../../_services/pro-user/pro-user.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';

import {AlertDialogService} from '../../../../modal/alert/alert-dialog.service';
import {GoogleOAuthService} from '../../../../_services/google-oauth/google-oauth.service';
import {EmailsValidator} from '../../../../constant';

@Component({
  selector: 'app-ratings-and-reviews',
  templateUrl: './ratings-and-reviews.component.html',
  styleUrls: ['./ratings-and-reviews.component.scss']
})
export class RatingsAndReviewsComponent implements OnInit, OnDestroy {
  public requestReviewsForm: FormGroup;
  public proUser: any;
  public destroy$: any = new Subject<any>();
  public submitted: any = false;
  public msg: any = '';

  constructor(private formBuilder: FormBuilder,
              private proUserService: ProUserService,
              private alertDialog: AlertDialogService,
              private googleOAuth: GoogleOAuthService,
              private store: Store<any>) {
    this.msg += 'Dear client,\n\n';
    this.msg += 'We rely on your referrals to improve our online reputation and grow our business. ';
    this.msg += 'We would sincerely appreciate it if you could write a brief review of our services at ewo360.com, ';
    this.msg += 'an online marketplace dedicated to the wellness industry.\n\n';
    this.msg += 'Our sincere thanks for your assistance.';
  }

  ngOnInit() {
    this.createRequestReviews();
    this.getProUser();
  }

  get f() {
    return this.requestReviewsForm.controls;
  }

  trimWhiteSpace(str: any) {
    this.requestReviewsForm.patchValue({emails: str.replace(/\s+/g, '')});
  }

  createRequestReviews() {
    this.requestReviewsForm = this.formBuilder.group({
      emails: ['', [EmailsValidator.emailsValidator]],
      message: [this.msg, []],
      btnName: 'Send'
    });
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.proUser = res.proUser;
        }
      });
  }

  updateForm(data?) {
    const emails: any = data && data.emails ? data.emails : '';
    const message: any = this.msg;
    this.requestReviewsForm.patchValue({emails, message});
    this.requestReviewsForm.markAsPristine();
  }

  async getMails() {
    const emails: any = await this.googleOAuth.fetchMails();
    this.requestReviewsForm.patchValue({emails: ''});
    this.requestReviewsForm.patchValue({emails});
  }

  async saveRR() {
    const payload: any = await this.onRRSubmit();
    if (payload) {
      this.sendReviewsRequests(payload);
    }
  }

  async onRRSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }
    // stop here if form is invalid
    if (this.requestReviewsForm.invalid) {
      await this.alertDialog.alert('The following are not valid email addresses. Please check them and re-enter correctly: ' +
        this.requestReviewsForm.getRawValue().emails);
      return;
    }
    return this.requestReviewsForm.getRawValue();
  }

  async sendReviewsRequests(data) {
    try {
      this.requestReviewsForm.markAsPristine();
      this.requestReviewsForm.patchValue({btnName: 'Sending'});
      const res: any = await this.proUserService.sendReviewsRequests(this.proUser._id, data);
      this.requestReviewsForm.patchValue({btnName: 'Sent'});
      if (res && res.status === 'success') {
        await this.alertDialog.alert('Email requests sent. You will be alerted when a new review is posted to your profile.');
        this.updateForm(res.data);
      }
    } catch (e) {
      this.requestReviewsForm.patchValue({btnName: 'Not Sent'});
      console.log('RatingsAndReviewsComponent -> sendReviewsRequests', e);
    }
  }

  resetBtnName() {
    this.requestReviewsForm.patchValue({btnName: 'Send'});
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
