import {Directive, EventEmitter, HostListener, OnDestroy, Output} from '@angular/core';
import {takeUntil} from 'rxjs/operators/index';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import * as _ from 'lodash';

import {AppState} from '../../app.state';
import {SignUpDialogService} from '../../modal/sign-up-popup/sign-up-dialog.service';

@Directive({
  selector: '[appCheckLoginClick]'
})
export class CheckLoginClickDirective implements OnDestroy {

  @Output() ngClick: EventEmitter<any> = new EventEmitter();
  private currentUser: any;
  private destroy$: any = new Subject<any>();

  constructor(private store: Store<AppState>,
              private signUpDialogService: SignUpDialogService) {
    this.loginData();
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    document.body.click();
    e.preventDefault();
    e.stopPropagation();
    if (this.currentUser) {
      this.ngClick.next(e);
    } else {
      this.signUpDialogService.openModal(true);
    }
  }

  loginData() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
