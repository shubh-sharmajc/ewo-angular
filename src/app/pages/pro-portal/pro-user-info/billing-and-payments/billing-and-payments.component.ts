import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators/index';
import * as op from 'object-path';

import {AppState} from '../../../../app.state';
import {BusinessService} from '../../../../_services/business/business.service';
import {ConfigurationService} from '../../../../_services/configuration/configuration.service';
import {AuthService} from '../../../../_services/auth/auth.service';
import {AlertDialogService} from '../../../../modal/alert/alert-dialog.service';

@Component({
  selector: 'app-billing-and-payments',
  templateUrl: './billing-and-payments.component.html',
  styleUrls: ['./billing-and-payments.component.scss']
})
export class BillingAndPaymentsComponent implements OnInit, OnDestroy {

  @Output() next = new EventEmitter<any>();
  @Output() pause = new EventEmitter<any>();
  @Input() newUser: any;
  @Input() editUser: any;
  public destroy$: any = new Subject<any>();
  public proUser: any;
  public currentPlan: any;
  public planID: any;
  public ANNUAL: any = 'Annual';
  public payment: any;
  public plans: any[];

  constructor(private store: Store<AppState>,
              private activatedRoute: ActivatedRoute,
              private configurationService: ConfigurationService,
              private auth: AuthService,
              private businessService: BusinessService,
              private alertDialog: AlertDialogService) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.planID = op.get(params, 'plan');
        this.payment = op.get(params, 'payment', this.ANNUAL);
      });
  }

  ngOnInit() {
    this.getProUserData();
    this.getPricePlans();
  }

  public calculatePlanPrice(plan: any) {
    if (op.get(plan, 'annualPrice')) {
      if (this.payment === this.ANNUAL) {
        return `$${op.get(plan, 'annualPrice')}`;
      }
      return `$${op.get(plan, 'price')}`;
    }
    return 'NA';
  }

  private getProUserData() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.proUser = op.get(res, 'proUser');
      });
  }

  public async getPricePlans() {
    try {
      const res: any = await this.configurationService.getPricePlans();
      if (op.get(res, 'status') === 'success') {
        this.plans = op.get(res, 'data');
        this.setCurrentPlan();
      }
    } catch (e) {
      console.log('BillingAndPaymentsComponent -> getPricePlans ::: ', e);
    }
  }

  private setCurrentPlan() {
    if (this.planID) {
      this.currentPlan = this.plans.find((o: any) => o._id === this.planID);
    } else if (!op.get(this.proUser, 'business.plan')) {
      this.currentPlan = this.plans.find((o: any) => !op.get(o, 'annualPrice'));
    } else {
      this.currentPlan = this.plans.find((o: any) => o._id === op.get(this.proUser, 'business.plan'));
    }
  }

  public async makePayment() {
    try {
      await this.businessService.updateProUserPlan(op.get(this.proUser, 'business._id'), {planId: this.currentPlan._id});
      await this.auth.getProUser();
      this.alertDialog.alert('Plan upgraded.');
    } catch (e) {
      console.log('BillingAndPaymentsComponent -> makePayment ::: ', e);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
