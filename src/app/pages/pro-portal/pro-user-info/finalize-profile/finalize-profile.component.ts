import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import * as op from 'object-path';

@Component({
  selector: 'app-finalize-profile',
  templateUrl: './finalize-profile.component.html',
  styleUrls: ['./finalize-profile.component.scss']
})
export class FinalizeProfileComponent implements OnInit, OnDestroy {

  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  public proUser: any;
  public business: any;
  public destroy$: any = new Subject<any>();

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
    this.getProUser();
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.proUser = res.proUser;
          this.business = op.get(this.proUser, 'business');
        }
      });
  }

  previousEvent() {
    const payload: any = {};
    payload.paused_step = 3;
    this.previous.emit(payload);
  }

  nextEvent() {
    const payload: any = {};
    payload.paused_step = 5;
    payload.is_complete = true;
    this.next.emit(payload);
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
