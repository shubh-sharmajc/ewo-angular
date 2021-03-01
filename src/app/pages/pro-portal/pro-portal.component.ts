import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators/index';
import {Subject} from 'rxjs';
import * as op from 'object-path';

@Component({
  selector: 'app-pro-portal',
  templateUrl: './pro-portal.component.html',
  styleUrls: ['./pro-portal.component.scss']
})
export class ProPortalComponent implements OnInit, OnDestroy {

  public username: any;
  public destroy$: any = new Subject<any>();

  constructor(private store: Store<any>,
              public router: Router) {
  }

  ngOnInit() {
    this.getUserByUserName();
  }

  getUserByUserName() {
    try {
      this.store.select('user')
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (res) => {
          const user: any = op.get(res, 'user.data');
          if (user) {
            this.username = op.get(user, 'username');
          }
        });
    } catch (e) {
      console.log('ProPortalComponent -> getUserByUserName :: ', e);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
