import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators/index';
import {Subject} from 'rxjs';
import Stepper from 'bs-stepper';
import * as op from 'object-path';

import {AuthService} from '../../../_services/auth/auth.service';
import {ProUserService} from '../../../_services/pro-user/pro-user.service';
import {GetProUserAction} from '../../../store/actions/pro-actioin';
import {AppState} from '../../../app.state';
import {PauseRegistrationService} from '../../../modal/pro-modal/pause-registration/pause-registration.service';
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {WarningReminderService} from '../../../modal/pro-modal/warning-reminder/warning-reminder.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-pro-sign-up',
  templateUrl: './pro-sign-up.component.html',
  styleUrls: ['./pro-sign-up.component.scss']
})
export class ProSignUpComponent implements OnInit, OnDestroy {

  private stepper: Stepper;
  public stepIndex: any;
  public user_id: any;
  public proUser: any;
  public business: any;
  public destroy$: any = new Subject<any>();

  constructor(private idle: Idle,
              private readonly elementRef: ElementRef,
              private spinner: NgxSpinnerService,
              private store: Store<AppState>,
              public router: Router,
              private auth: AuthService,
              private proUserService: ProUserService,
              private pauseRegistrationDialogService: PauseRegistrationService,
              private warningReminderService: WarningReminderService) {
  }

  ngOnInit() {
    if (this.router.url.includes('sign-up')) {
      this.store.dispatch(new GetProUserAction(null));
    }
    const stepperEl = this.elementRef.nativeElement.querySelector('#pro-sign-up-stepper');

    stepperEl.addEventListener('show.bs-stepper', (event: any) => {
      this.stepIndex = event.detail.to;
      this.stepProgress(event.detail.to);
    });
    this.stepper = new Stepper(stepperEl, {
      linear: true,
      animation: true
    });
    this.getProUser();
    this.startIdleTimer();
  }

  async next(data) {
    data.is_paused = true;
    await this.updateProUser(data);
    this.stepper.next();
    const res: any = await this.auth.getProUser();
    if (data.is_complete && data.paused_step > 4) {
      const proUser: any = op.get(res, 'data');
      this.router.navigate([`/pro/user/${proUser.username}`]);
    }
    window.scrollTo(0, 0);
  }

  async previous(data) {
    data.is_paused = true;
    await this.updateProUser(data);
    this.stepper.previous();
    await this.auth.getProUser();
    window.scrollTo(0, 0);
  }

  async pause(data) {
    const res: any = await this.pauseRegistrationDialogService.openPauseRegistrationModal();
    if (res) {
      data.is_paused = true;
      await this.updateProUser(data);
      await this.logout();
    }
  }

  async logout() {
    try {
      this.spinner.show();
      await this.auth.logout();
      this.spinner.hide();
      this.router.navigate(['/signin']);
    } catch (e) {
      console.error('ProSignUpComponent -> Logout ::: ', e);
    }
  }

  stepProgress(stepIndex: any) {
    const stepsEl = this.elementRef.nativeElement.querySelector('#pro-sign-up-stepper')
      .querySelector('#pro-sign-up-stepper-header').querySelectorAll('.step');
    for (let intIndex = 0; intIndex < stepsEl.length; intIndex++) {
      stepsEl[intIndex].classList.remove('step-progress');
      const previousElementSibling: any = stepsEl[intIndex].previousElementSibling;
      if (previousElementSibling) {
        previousElementSibling.classList.remove('progress-line');
      }
      const nextElementSibling: any = stepsEl[intIndex].nextElementSibling;
      if (nextElementSibling) {
        nextElementSibling.classList.remove('success-line');
        nextElementSibling.classList.remove('progress-line');
      }
    }
    for (let intIndex = 0; intIndex < stepsEl.length; intIndex++) {
      if (stepIndex !== intIndex) {
        stepsEl[intIndex].classList.add('step-progress');
      }
      const previousElementSibling: any = stepsEl[intIndex].previousElementSibling;
      if (previousElementSibling) {
        previousElementSibling.classList.add('success-line');
      }
      const nextElementSibling: any = stepsEl[intIndex].nextElementSibling;
      if (nextElementSibling && stepIndex === intIndex) {
        nextElementSibling.classList.add('progress-line');
        break;
      }
    }
  }

  async getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.proUser = op.get(res, 'proUser');
        this.user_id = op.get(res, 'proUser._id');
        this.business = op.get(res, 'proUser.business');
        if (op.get(this.business, 'is_paused')) {
          let paused_step: any = parseInt(op.get(this.business, 'paused_step'));
          if (paused_step < 1) {
            paused_step = 1;
          } else if (paused_step > 4) {
            paused_step = 4;
          }
          this.stepper.to(paused_step);
        }
      });
  }

  async updateProUser(data) {
    const location: any = op.get(op.get(this.business, 'locations', []).find((o: any) => o.is_default), 'location');
    await this.proUserService.updateProUser(this.user_id, op.get(location, '_id'), data);
  }

  onSubmit() {
    return false;
  }

  startIdleTimer() {
    this.idle.setIdle(60 * 10);
    this.idle.setTimeout(60 * 5);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const is_complete: any = op.get(this.proUser, 'business.is_complete');
        if (!is_complete) {
          this.warningReminderService.openWarningReminderModal()
            .then(async () => {
              await this.updateProUser({is_paused: true});
              await this.auth.logout();
              window.location.href = `${environment.SITE_URL}/signin`;
            })
            .catch(() => {
              this.reset();
            });
        }
      });
    this.reset();
  }

  reset() {
    this.idle.watch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
    this.idle.stop();
  }

}
