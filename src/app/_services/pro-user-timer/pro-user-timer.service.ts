import {Injectable} from '@angular/core';
import {Subject, Subscription, timer} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProUserTimerService {

  private subscription: Subscription;
  private _onTimeOut: Subject<any> = new Subject();

  constructor() {
  }

  startTimer(dueTime = 0, period = 0) {
    this.subscription = timer(dueTime, period)
      .subscribe(() => {
        this._onTimeOut.next();
      });
  }

  stopTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onTimeout() {
    return this._onTimeOut.asObservable();
  }
}
