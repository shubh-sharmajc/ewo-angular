import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators/index';
import * as op from 'object-path';

import {ConfigurationService} from '../../../../_services/configuration/configuration.service';
import {AppState} from '../../../../app.state';
import {ConfirmDialogService} from '../../../../modal/confirm/confirm-dialog.service';
import {AccountDowngradeService} from '../../../../modal/pro-modal/account-downgrade/account-downgrade.service';

@Component({
  selector: 'app-pro-pricing',
  templateUrl: './pro-pricing.component.html',
  styleUrls: ['./pro-pricing.component.scss']
})
export class ProPricingComponent implements OnInit, OnDestroy {

  public plans: any[];
  public currentPlanId: any;
  public ANNUAL: any = 'Annual';
  public MONTHLY: any = 'Monthly';
  public payment: any = this.ANNUAL;
  public proUser: any;
  public business: any;
  public destroy$: any = new Subject<any>();

  constructor(private router: Router,
              private store: Store<AppState>,
              private configurationService: ConfigurationService,
              private confirmDialogService: ConfirmDialogService,
              private accountDowngradeService: AccountDowngradeService) {
  }

  ngOnInit() {
    this.getProUserData();
    this.getPricePlans();
  }

  private getProUserData() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.proUser = op.get(res, 'proUser');
        this.business = op.get(res, 'proUser.business');
        this.currentPlanId = op.get(res, 'proUser.business.plan');
      });
  }

  public async getPricePlans() {
    try {
      const res: any = await this.configurationService.getPricePlans();
      if (op.get(res, 'status') === 'success') {
        this.plans = op.get(res, 'data');
        if (!this.currentPlanId) {
          this.currentPlanId = op.get(this.plans.filter((o: any) => !op.get(o, 'annualPrice')), '0._id');
        }
      }
    } catch (e) {
      console.log('ProPricingComponent -> getPricePlans ::: ', e);
    }
  }

  public calculatePlanPrice(plan: any) {
    if (op.get(plan, 'annualPrice')) {
      if (this.payment === this.ANNUAL) {
        return `$${op.get(plan, 'annualPrice')}`;
      }
      return `$${op.get(plan, 'price')}`;
    }
    return 'FREE';
  }

  private getPlanIndex(_id: string) {
    return this.plans.findIndex((o: any) => o._id === _id);
  }

  public async selectProUserPlanID(plan: any) {
    try {
      if (this.proUser) {
        let res: any = false;
        if (this.getPlanIndex(this.currentPlanId) > this.getPlanIndex(plan._id)) {
          res = await this.accountDowngradeService.openModal();
        } else {
          const title: any = 'Confirm plan change';
          const message: any = 'Please confirm you wish to change your existing plan.';
          res = await this.confirmDialogService.confirm(title, message);
        }
        if (res) {
          this.router.navigate([`/pro/account/billing-and-payments`], {queryParams: {plan: plan._id, payment: this.payment}});
        }
      } else {
        this.router.navigate([`/signin`]);
      }
    } catch (e) {
      console.log('ProPricingComponent -> updateProUserPlan ::: ', e);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
