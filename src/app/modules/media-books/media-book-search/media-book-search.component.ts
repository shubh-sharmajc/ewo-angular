import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ScrollEvent} from 'ngx-scroll-event';
import {Location} from '@angular/common';
import * as _ from 'lodash';
import * as op from 'object-path';

import {AppState} from '../../../app.state';
import {MediaBookService} from '../../../_services/media-book/media-book.service';
import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';
import {DeleteDialogService} from '../../../modal/delete/delete-dialog.service';
import {CreateMediaBookComponent} from '../create-media-book/create-media-book.component';
import {AlertDialogService} from '../../../modal/alert/alert-dialog.service';
import {PRO_USER_ROLES} from '../../../constant';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-media-book-search',
  templateUrl: './media-book-search.component.html',
  styleUrls: ['./media-book-search.component.scss']
})
export class MediaBookSearchComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('search') searchInputElement: ElementRef;
  public dialogCreateMediaBookRef: MatDialogRef<CreateMediaBookComponent>;
  public searchOutput: any = new Subject<string>();
  public destroy$: any = new Subject<any>();
  public mediaBookList: any[];
  public selectedAction: any;
  public pageNo: any = 1;
  public isScrollChange: any = false;
  public currentUser: any = {_id: null};
  public selectAction: any = {name: ''};
  public actions: any = [{name: 'Delete Mediabook', disabled: true}];
  public searchMediabook: any = [{name: 'All Mediabooks', disabled: false}, {name: 'Selected Mediabooks', disabled: true}];
  public qp: any = {ssa: 'All Mediabooks'};
  public proUserRoles: any = PRO_USER_ROLES;
  public WP_STORIES_LINK = `${environment.WP_STORIES_LINK}`;

  constructor(private store: Store<AppState>,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              public dialog: MatDialog,
              public deleteDialog: DeleteDialogService,
              private mediaBookService: MediaBookService,
              private alertDialogService: AlertDialogService,
              private mediaBookItemsService: MediaBookItemsService) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.qp.t = params.t;
      this.qp.mbs = params.mbs;
      this.qp.ssa = params.mbs ? 'Selected Mediabooks' : params.ssa;
    });
    // Debounce search.
    this.searchOutput.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.qp.t = value;
          this.updateRoute();
          this.searchMediaBookList();
        } else {
          this.goToMBPage();
        }
      });
  }

  ngOnInit() {
    this.getLoginUser();
    this.searchMediaBookList();
    if (this.qp.mbs) {
      this.actions = [{name: 'Delete Mediabook', disabled: false}];
      this.searchMediabook = [{name: 'All Mediabooks', disabled: false}, {name: 'Selected Mediabooks', disabled: false}];
    }
    if (!this.qp.t) {
      this.goToMBPage();
    }
  }

  ngAfterViewInit() {
    this.searchInputElement.nativeElement.focus();
  }

  public updateRoute() {
    const urlPrefix: any = PRO_USER_ROLES.indexOf(this.currentUser.role) > -1 ? '/pro/manage-media' : '/user';
    const urlTree: any = this.router.createUrlTree([`${urlPrefix}/${this.currentUser.username}/mediabooks/search`], {queryParams: this.qp});
    this.location.replaceState(urlTree.toString());
  }

  public goToMBPage() {
    const urlPrefix: any = PRO_USER_ROLES.indexOf(this.currentUser.role) > -1 ? '/pro/manage-media' : '/user';
    this.router.navigate([`${urlPrefix}/${this.currentUser.username}/mediabooks`]);
  }

  public getMBIds() {
    if (this.qp.ssa === 'Selected Mediabooks') {
      this.qp.mbs = this.mediaBookList.filter((o) => o.checked).map((o: any) => o._id).join();
    } else {
      delete this.qp.mbs;
    }
    this.updateRoute();
  }

  goToUploadMB(mbl) {
    const urlPrefix: any = PRO_USER_ROLES.indexOf(this.currentUser.role) > -1 ? '/pro/manage-media' : '/user';
    this.router.navigate([`${urlPrefix}/${this.currentUser.username}/mediabooks/${mbl.mediabook._id}/upload`]);
  }

  getRedirectURL(mbItem: any) {
    switch (mbItem.type) {
      case 'ST':
        return this.WP_STORIES_LINK + mbItem.content;
      case 'PRO':
        return `/pro/user/${mbItem.content}`;
      default:
        return `/image-gallery/${mbItem.ref_id}`;
    }
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  async searchMediaBookList() {
    if (this.qp.t) {
      this.pageNo = 1;
      this.isScrollChange = false;
      await this.mediaBookService.searchMediaBookList(this.qp.t, this.pageNo, true, this.qp.mbs);
      this.store.select('mediaBook')
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res && res.searchList) {
            const sortedItems = _.sortBy(res.searchList, function (resp) {
              return resp.default ? 0 : 1;
            });
            this.mediaBookList = sortedItems.map((o: any) => {
              if (o.dataType === 'Mediabooks') {
                o.shared = op.get(o, 'created_by._id', null) !== op.get(this.currentUser, '_id', null);
                o.sharingAccess = o.sharing.find((s: any) => s.user && s.user._id === this.currentUser._id);
                if (this.qp.mbs && this.qp.mbs.includes(o._id)) {
                  o.checked = true;
                }
              }
              return o;
            });
          }
        });
    }
  }

  async scrollHandler($event: ScrollEvent) {
    if ($event.isReachingBottom && !this.isScrollChange) {
      this.isScrollChange = true;
      this.pageNo++;
      const resp: any = await this.mediaBookService.searchMediaBookList(this.qp.t, this.pageNo, false, this.qp.mbs);
      if (resp && !resp.length) {
        this.isScrollChange = true;
      } else {
        this.isScrollChange = false;
      }
    }
  }

  getMediaBookItemType(type: string) {
    switch (type) {
      case 'IMG':
        return 'Photo';
      case 'XP':
        return 'Experience';
      case 'ST':
        return 'Story';
      case 'CON':
        return 'Conversation';
      case 'PRO':
        return 'Provider';
      default:
        return type;
    }
  }

  goToMBItems($event, mbl: any) {
    $event.preventDefault();
    const urlPrefix: any = PRO_USER_ROLES.indexOf(this.currentUser.role) > -1 ? '/pro/manage-media' : '/user';
    this.router.navigate([`${urlPrefix}/${this.currentUser.username}/mediabooks/${mbl._id}/items`]);
  }

  changeItemNotes(obj) {
    this.updateMediaBookItem(obj.mediabook._id, obj._id, {notes: obj.notes});
  }

  async changeMediabookNotes(id, notes) {
    await this.mediaBookService.updateMediaBook(id, {notes: notes});
  }

  async updateMediaBookItem(mediaBookId, itemId, bodyObj: any) {
    try {
      await this.mediaBookItemsService.updateMediaBookItem(mediaBookId, itemId, bodyObj);
    } catch (e) {
      console.error('MediaBookSearchComponent -> updateMediaBookItem', e);
    }
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

  searchMenuChange() {
    this.getMBIds();
    this.searchMediaBookList();
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
      this.qp.ssa = 'All Mediabooks';
      this.searchMediabook = this.searchMediabook.map((o) => {
        o.disabled = o.name === 'Selected Mediabooks';
        return o;
      });
      this.actions = this.actions.map((o) => {
        o.disabled = o.name === 'Delete Mediabook';
        return o;
      });
    }
    this.getMBIds();
  }

  createMediabook() {
    this.dialogCreateMediaBookRef = this.dialog.open(CreateMediaBookComponent, {
      width: '485px',
      height: '490px',
      disableClose: true
    });
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

  deleteMediaBook(id: string) {
    this.deleteDialog.delete('Are you sure you want to delete selected item(s)?')
      .then(async () => await this.mediaBookService.deleteMediaBook(id));
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

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
