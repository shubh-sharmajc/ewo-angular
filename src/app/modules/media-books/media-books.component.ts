import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators/index';
import {Subject} from 'rxjs';
import {ScrollEvent} from 'ngx-scroll-event';
import * as _ from 'lodash';

import {DeleteDialogService} from '../../modal/delete/delete-dialog.service';
import {MediaBookService} from '../../_services/media-book/media-book.service';
import {UserService} from '../../_services/user/user.service';
import {AppState} from '../../app.state';
import {CreateMediaBookComponent} from './create-media-book/create-media-book.component';
import {AlertDialogService} from '../../modal/alert/alert-dialog.service';
import {PRO_USER_ROLES} from '../../constant';

@Component({
  selector: 'app-media-books',
  templateUrl: './media-books.component.html',
  styleUrls: ['./media-books.component.scss']
})
export class MediaBooksComponent implements OnInit, OnDestroy {

  public dialogCreateMediaBookRef: MatDialogRef<CreateMediaBookComponent>;
  public destroy$: any = new Subject<any>();
  public mediaBookList: any[];
  public ids: any;
  public actions: any = [{name: 'New Mediabook', disabled: false}, {name: 'Delete Mediabook', disabled: true}];
  public searchMediabook: any = [{name: 'All Mediabooks', disabled: false}, {name: 'Selected Mediabooks', disabled: true}];
  public searchInput: any;
  public searchOutput: any = new Subject<string>();
  public pageNo: any = 1;
  public isScrollChange: any = false;
  public currentUser: any;
  public user: any;
  public selectAction: any = {name: ''};
  public selectedSearchAction: any = {name: 'All Mediabooks'};
  public proUserRoles: any = PRO_USER_ROLES;

  constructor(private store: Store<AppState>,
              public dialog: MatDialog,
              private router: Router,
              private alertDialogService: AlertDialogService,
              private activatedRoute: ActivatedRoute,
              private mediaBookService: MediaBookService,
              private _userService: UserService,
              private deleteDialog: DeleteDialogService) {
    // Debounce search.
    this.searchOutput.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          const queryParams: any = {t: value, ssa: this.selectedSearchAction.name};
          if (this.selectedSearchAction.name === 'Selected Mediabooks') {
            queryParams.mbs = this.mediaBookList.filter((o: any) => o.checked).map((o: any) => o._id).join();
          }
          const urlPrefix: any = PRO_USER_ROLES.indexOf(this.currentUser.role) > -1 ? '/pro/manage-media' : '/user';
          this.router.navigate([`${urlPrefix}/${this.currentUser.username}/mediabooks/search`], {queryParams});
        }
      });
  }

  ngOnInit() {
    this.getUserByUserName();
  }

  updateActionMenu() {
    const MB = this.mediaBookList.filter((o: any) => !o.shared && !o.default);
    if (MB.length < 10) {
      this.actions = [{name: 'New Mediabook', disabled: false}, {name: 'Delete Mediabook', disabled: true}];
    } else {
      this.actions = [{name: 'Delete Mediabook', disabled: true}];
    }
  }

  getUserByUserName() {
    this.store.select('user')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.user && res.user.data) {
          this.user = res.user.data;
          this.getLoginUser();
        }
      });
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
        this.getMediaBooks();
      });
  }

  async getMediaBooks() {
    const userID: any = this.currentUser && this.user && this.currentUser.username !== this.user.username && this.user._id;
    await this.mediaBookService.getMediaBookList(this.pageNo, userID, true);
    this.store.select('mediaBook')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.list) {
          const sortedItems = _.sortBy(res.list, function (resp) {
            return resp.default ? 0 : 1;
          });
          this.mediaBookList = sortedItems.map((o: any) => {
            if (_.isObject(o.created_by)) {
              o.shared = o.created_by._id !== (this.user && this.user._id);
            } else {
              o.shared = o.created_by !== (this.user && this.user._id);
            }
            return o;
          });
          this.updateActionMenu();
        }
      });
  }

  async scrollHandler($event: ScrollEvent) {
    if ($event.isReachingBottom && !this.isScrollChange) {
      this.isScrollChange = true;
      this.pageNo++;
      const userID: any = this.currentUser && this.user && this.currentUser.username !== this.user.username && this.user._id;
      const resp: any = await this.mediaBookService.getMediaBookList(this.pageNo, userID);
      if (resp && resp.data && !resp.data.length) {
        this.isScrollChange = true;
      } else {
        this.isScrollChange = false;
      }
    }
  }

  deleteMediaBook(ids: string) {
    this.deleteDialog.delete('Are you sure you want to delete selected item(s)?')
      .then(async () => await this.mediaBookService.deleteMediaBook(ids));
  }

  createMediabook() {
    this.dialogCreateMediaBookRef = this.dialog.open(CreateMediaBookComponent, {
      width: '485px',
      height: '490px',
      disableClose: true
    });
  }

  getImgForEmptyMB(name: string) {
    let URL: string;
    switch (name) {
      case 'Saved Items':
        URL = 'assets/img/mediabook/saved-items-mediabook.png';
        break;
      case 'Uploaded Items':
        URL = 'assets/img/mediabook/uploaded-items-mediabook.png';
        break;
      case 'About Us':
        URL = 'assets/img/mediabook/about-us.png';
        break;
      default:
        URL = 'assets/img/mediabook/new-mediabook.png';
    }
    return `${URL}`;
  }

  deleteSelectedMediaBook() {
    const defaultORShare: any = this.mediaBookList.filter((o: any) => o.checked && (o.default || o.shared));
    if (defaultORShare && !defaultORShare.length) {
      const getIdes: any = this.mediaBookList.filter((o: any) => o.checked).map((o: any) => o._id);
      if (getIdes && getIdes.length) {
        this.deleteMediaBook(getIdes.join());
      }
    } else {
      this.alertDialogService.alert('Default/Shared mediabook cannot be deleted');
    }
  }

  actionChange(selectAction) {
    this.selectAction = {...this.selectAction, name: ''};
    switch (selectAction) {
      case 'New Mediabook':
        this.createMediabook();
        break;
      case 'Delete Mediabook':
        this.deleteSelectedMediaBook();
        break;
    }
  }

  checkboxChange() {
    const filterData: any = this.mediaBookList.filter((o) => o.checked);
    if (filterData && filterData.length) {
      this.searchMediabook = this.searchMediabook.map((o) => {
        o.disabled = false;
        return o;
      });
      this.actions = this.actions.map((o) => {
        o.disabled = false;
        return o;
      });
    } else {
      this.searchMediabook = this.searchMediabook.map((o) => {
        o.disabled = o.name === 'Selected Mediabooks';
        return o;
      });
      this.actions = this.actions.map((o) => {
        o.disabled = o.name === 'Delete Mediabook';
        return o;
      });
    }
  }

  searchMenuChange() {
    if (this.selectedSearchAction === 'All mediabooks') {
      this.selectedSearchAction = this.selectedSearchAction.map((o) => {
        o.disabled = o.name !== 'All mediabooks';
        return o;
      });
    }
    switch (this.selectedSearchAction.name) {
      case 'All Mediabooks':
        this.selectedSearchAction = {...this.selectedSearchAction, name: 'All Mediabooks'};
        break;
      case 'Selected Mediabooks':
        this.selectedSearchAction = {...this.selectedSearchAction, name: 'Selected Mediabooks'};
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

  async changeMediabookNotes(_id: any, notes: any) {
    await this.mediaBookService.updateMediaBook(_id, {notes: notes});
  }

}
