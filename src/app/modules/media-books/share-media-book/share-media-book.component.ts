import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {concat, Observable, of, Subject, Subscriber} from 'rxjs';
import {catchError, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {debounceTime} from 'rxjs/internal/operators';
import * as _ from 'lodash';
import * as op from 'object-path';

import {UserService} from '../../../_services/user/user.service';
import {MediaBookService} from '../../../_services/media-book/media-book.service';
import {GoogleOAuthService} from '../../../_services/google-oauth/google-oauth.service';

@Component({
  selector: 'app-share-media-book',
  templateUrl: './share-media-book.component.html',
  styleUrls: ['./share-media-book.component.scss']
})
export class ShareMediaBookComponent implements OnInit {
  public submitted: any = false;
  public whoHasAccessArr: any = [{name: 'Can View', value: 0}, {name: 'Can Edit', value: 1}];
  public usersLoading: any = false;
  public selectedUser: any;
  public showError: any = false;
  public showEmailError: any = false;
  public items$: Observable<any[]>;
  public input$ = new Subject<string | null>();
  public sharingUserArr: any[] = [];
  public emailSharesArr: any[] = [];

  constructor(private dialogRef: MatDialogRef<ShareMediaBookComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private googleOAuth: GoogleOAuthService,
              private userService: UserService,
              private mediaBookService: MediaBookService) {
  }

  ngOnInit() {
    if (_.isObject(this.data) && _.isArray(this.data.sharing)) {
      this.sharingUserArr = this.data.sharing.map((o: any) => {
        o.user.access = o.access;
        o.user.name = `${o.user.first_name} ${o.user.last_name.charAt(0)}.`;
        return o.user;
      });
    }
    if (_.isObject(this.data) && _.isArray(this.data.shares)) {
      this.emailSharesArr = this.data.shares.map((o: any) => {
        o.isExternalUser = true;
        return o;
      });
    }
    this.searchUser();
  }

  closeDialog(data?: any) {
    this.dialogRef.close(data);
  }

  async getMails() {
    const emails: any = await this.googleOAuth.fetchMails();
    this.selectedUser = {name: emails, email: emails, picture_url: 'assets/img/user.svg', isExternalUser: true};
    this.items$ = Observable.create((observer: Subscriber<any>) => {
      observer.next([this.selectedUser]);
      observer.complete();
    });
  }

  private searchUser() {
    this.items$ = <any>concat(
      of([]), // default items
      this.input$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.usersLoading = true),
        switchMap(term => this.userService.searchUser({limit: 5, searchString: term}).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.usersLoading = false)
        ))
      )
    );
  }

  public changeUser() {
    if (this.selectedUser) {
      this.showError = this.sharingUserArr.find((o: any) => o._id === this.selectedUser._id);
      this.showEmailError = this.emailSharesArr.find((o: any) => o.email === this.selectedUser.email);
      this.selectedUser.access = 0;
      if (!this.showEmailError && this.selectedUser.isExternalUser) {
        const emails: any = op.get(this.selectedUser, 'email').split(',');
        emails.forEach((o) => {
          const index: any = this.emailSharesArr.findIndex((e) => e === o);
          if (index === -1) {
            this.emailSharesArr.push({name: o, email: o, picture_url: 'assets/img/user.svg', isExternalUser: true});
          }
        });
      } else if (!this.showError && !this.showEmailError) {
        this.sharingUserArr.push(this.selectedUser);
      }
    }
  }

  removeUser(index: any) {
    this.sharingUserArr.splice(index, 1);
  }

  removeUserEmail(index: any) {
    this.emailSharesArr.splice(index, 1);
  }

  async save() {
    try {
      if (this.sharingUserArr) {
        await this.mediaBookService.accessMediaBook(this.data._id, this.sharingUserArr.map((o: any) => {
          return {user: o._id, access: o.access};
        }));
      }
      if (this.emailSharesArr.length) {
        const filterEmail: any = this.emailSharesArr.filter((o: any) => !o._id).map((o) => o.email);
        if (filterEmail.length) {
          const payloadObj: any = {
            emails: filterEmail.join(),
            subject: `Mediabook: ${this.data.name}`,
            message: `I found some cool stuff on EWO. Check it out and let me know what you think!`
          };
          await this.mediaBookService.shareMediaBook(this.data._id, payloadObj);
        }
      }
      this.closeDialog();
    } catch (e) {
      console.error('ShareMediaBookComponent -> save');
    }
  }

}
