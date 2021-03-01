import {Component, OnDestroy, OnInit} from '@angular/core';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ScrollEvent} from 'ngx-scroll-event';
import {NgxSpinnerService} from 'ngx-spinner';
import * as _ from 'lodash';
import * as op from 'object-path';

import {CreateMediaBookComponent} from '../create-media-book/create-media-book.component';
import {environment} from '../../../../environments/environment';
import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';
import {CopyToMediabookComponent} from '../copy-to-mediabook/copy-to-mediabook.component';
import {ShareMediaBookComponent} from '../share-media-book/share-media-book.component';
import {ShareMediaBookItemComponent} from '../share-media-book-item/share-media-book-item.component';
import {DeleteDialogService} from '../../../modal/delete/delete-dialog.service';
import {ShareViaEmailDialogService} from '../../../modal/share-via-email/share-via-email-dialog.service';
import {MainService} from '../../../_services/main.service';
import {AlertDialogService} from '../../../modal/alert/alert-dialog.service';
import {PRO_USER_ROLES, USER_ROLES} from '../../../constant';
import {LinkToMediabookService} from '../link-to-media-book/link-to-mediabook.service';
import {MediaBookService} from '../../../_services/media-book/media-book.service';

declare var $: any;

@Component({
  selector: 'app-media-book-items',
  templateUrl: './media-book-items.component.html',
  styleUrls: ['./media-book-items.component.scss']
})
export class MediaBookItemsComponent implements OnInit, OnDestroy {

  public WP_STORIES_LINK = `${environment.WP_STORIES_LINK}`;
  public copyToMediabookDialogRef: MatDialogRef<CopyToMediabookComponent>;
  public dialogCreateMediaBookRef: MatDialogRef<CreateMediaBookComponent>;
  public dialogShareMediaBookRef: MatDialogRef<ShareMediaBookComponent>;
  public actions: any = [{name: 'Upload', disabled: true},
    {name: 'Set cover image', disabled: true},
    {name: 'Share', disabled: true},
    {name: 'Email', disabled: true},
    {name: 'Delete', disabled: true},
    {name: 'Link to Mediabook', disabled: true},
    {name: 'Copy to mediabook', disabled: true}];
  public filterByArr: any = [{name: 'Show All', value: ''},
    {name: 'Pro profiles', value: 'PRO'},
    {name: 'Images', value: 'XP,IMG'},
    {name: 'Stories', value: 'ST'}];
  public selectedFilterBy: any;
  public selectedAction: any;
  public mediaBookId: any;
  public mediaBookObj: any;
  public loading = false;
  public mediaBookItems: any[];
  public destroy$: any = new Subject<any>();
  public isScrollChange: any = false;
  public pageNo: any = 1;
  public currentUser: any;
  public user: any;
  public disable: any;
  public isMixContent: any;
  public mediaBookCreatorId: any;
  public proUserRoles: any = PRO_USER_ROLES;
  public userRoles: any = USER_ROLES;

  constructor(private store: Store<any>,
              public sanitizer: DomSanitizer,
              public dialog: MatDialog,
              private spinner: NgxSpinnerService,
              private linkToMediaBookService: LinkToMediabookService,
              public router: Router,
              public alertDialog: AlertDialogService,
              private shareViaEmailDialogService: ShareViaEmailDialogService,
              private _mainService: MainService,
              private activatedRoute: ActivatedRoute,
              private mediaBookService: MediaBookService,
              private mediaBookItemsService: MediaBookItemsService,
              private deleteDialog: DeleteDialogService) {
    this.activatedRoute.params.subscribe((params) => {
      this.mediaBookId = params.id;
    });
  }

  ngOnInit() {
    if (this.mediaBookId) {
      this.getLoginUser();
      this.getUserByUserName();
      this.getMediaBookItems();
    }
  }

  goToUploadMB(name) {
    if (name === 'Upload') {
      const urlPrefix: any = PRO_USER_ROLES.indexOf(this.currentUser.role) > -1 ? '/pro/manage-media' : '/user';
      this.router.navigate([`${urlPrefix}/${this.user.username}/mediabooks/${this.mediaBookId}/upload`]);
    }
  }

  updateDDAction(isShared: any) {
    if (isShared) {
      this.actions = [
        {name: 'Share', disabled: true}, {name: 'Email', disabled: true},
        {name: 'Copy to mediabook', disabled: true}];
    } else {
      this.actions = [
        {name: 'Set cover image', disabled: true},
        {name: 'Share', disabled: true},
        {name: 'Email', disabled: true},
        {name: 'Delete', disabled: true},
        {name: 'Link to Mediabook', disabled: true},
        {name: 'Copy to mediabook', disabled: true}];
      if (this.mediaBookObj.name !== 'Saved Items') {
        this.actions.unshift({name: 'Upload', disabled: false});
      }
    }
  }

  async changeFilterBy() {
    this.pageNo = 1;
    await this.mediaBookItemsService.getMediaBookItemList(this.mediaBookId, {type: this.selectedFilterBy}, this.pageNo, true);
  }

  actionChange() {
    if (!this.selectedAction) {
      this.actions = this.actions.map((o) => {
        o.disabled = o.name !== 'Actions';
        return o;
      });
      this.mediaBookItems = this.mediaBookItems.map((o: any) => {
        o.checked = false;
        return o;
      });
    } else {

      switch (this.selectedAction.name) {
        case 'Upload':
          this.goToUploadMB(this.selectedAction.name);
          break;
        case 'Delete':
          this.deleteMediaBookItem();
          break;
        case 'Link to Mediabook':   
            this.linkToMediaBook();
          break;
        case 'Copy to mediabook':
          this.copyToMediaBookItem();
          break;
        case 'Email':
          this.shareViaEmail();
          break;
        case 'Share':
          this.shareMediaBookItem();
          break;
        case 'Set cover image':
          this.setCover();
          break;
      }
      this.selectedAction = {...this.selectedAction, name: 'Actions'};
    }
  }

  checkboxChange() {
    const filterData: any = this.mediaBookItems.filter((o) => o.checked);
    if (filterData.length > 0) {
      if(!this.mediaBookObj.private){
        this.actions = this.actions.map((o) => {
          if (o.name === 'Email' || o.name === 'Share' || o.name === 'Set cover image' || o.name === 'Link to Mediabook') {
            if (o.name === 'Set cover image' && filterData.length === 1) {
              const type: any = op.get(filterData, '0.type');
              o.disabled = type === 'ST';
            } else {
              o.disabled = !(filterData.length === 1);
            }
          } else {
            o.disabled = false;
          }
          return o;
        });
      }else{
        this.actions = this.actions.map((o) => {
          o.disabled = o.name == 'Link to Mediabook';
          return o;
        });
      }
     
    } else {
      this.actions = this.actions.map((o) => {
        o.disabled = o.name !== 'Actions';
        return o;
      });
    }
  }

  shareViaEmail() {
    const selectedItem: any = this.mediaBookItems.filter((o) => o.checked)[0];
    this.shareViaEmailDialogService.share(selectedItem).then(async (res) => {
      try {
        await this.mediaBookItemsService.shareMediaBookItem(this.mediaBookId, selectedItem._id, res);
        this.alertDialog.alert('Email sent successfully.');
        this.actions = this.actions.map((o) => {
          o.disabled = o.name === '';
          return o;
        });
      } catch (e) {
        this.alertDialog.alert('Email(s) not sent.');
        console.log('MediaBookItemsComponent -> shareMediabook :: ', e);
      }
    });
  }

  changeItemNotes(itemId: string, notes: string) {
    this.updateMediaBookItem(itemId, {notes});
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
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  getUserByUserName() {
    this.store.select('user')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.user && res.user.data) {
          this.user = res.user.data;
          this.getMediaBook();
        }
      });
  }

  async getMediaBook() {
    try {
      await this.mediaBookService.getMediaBook(this.mediaBookId);
    } catch (e) {
      console.error('MediaBookItemsComponent -> getMediaBook', e);
    }

    this.store.select('mediaBook')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.item && res.item.data) {
          this.mediaBookObj = res.item.data;
          if (_.isObject(this.mediaBookObj)) {
            this.mediaBookObj.shareCount = 0;
            if (_.isArray(this.mediaBookObj.sharing)) {
              this.mediaBookObj.shareCount += this.mediaBookObj.sharing.length;
            }
            if (_.isArray(this.mediaBookObj.shares)) {
              this.mediaBookObj.shareCount += this.mediaBookObj.shares.length;
            }
            const isCurrentUsername: any = this.router.url.includes(this.currentUser.username);
            if (isCurrentUsername) {
              if (_.isObject(this.mediaBookObj.created_by)) {
                this.mediaBookObj.shared = this.mediaBookObj.created_by._id !== op.get(this.user, '_id');
              } else {
                this.mediaBookObj.shared = this.mediaBookObj.created_by !== op.get(this.user, '_id');
              }
            } else {
              this.mediaBookObj.shared = true;
            }
            this.mediaBookObj.sharingAccess = this.mediaBookObj.sharing.find((s: any) => op.get(s.user, '_id') === op.get(this.user, '_id'));
            this.updateDDAction(this.mediaBookObj.shared);
          }
        }
      });
  }

  async scrollHandler($event: ScrollEvent, type?: any) {
    if ($event.isReachingBottom && !this.isScrollChange) {
      this.isScrollChange = true;
      this.pageNo++;
      const resp: any = await this.mediaBookItemsService.getMediaBookItemList(this.mediaBookId, {type}, this.pageNo);
      if (resp && resp.data && !resp.data.length) {
        this.isScrollChange = true;
      } else {
        this.isScrollChange = false;
      }
    }
  }

  async getMediaBookItems(type?: any) {
    try {
      const response = await this.mediaBookItemsService.getMediaBookItemList(this.mediaBookId, {type}, this.pageNo, true);
      if (response) {
        this.isMixContent = response['mixContent'];
        this.mediaBookCreatorId = response['mediabook']['created_by'];
      }
    } catch (e) {
      console.error('MediaBookItemsComponent -> getMediaBookItems', e);
    }
    this.store.select('mediaBook')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.mediaBookItemList) {
          this.mediaBookItems = res.mediaBookItemList.map((o) => {
            if (o.subject && o.desc) {
              o.header_title = this.sanitizer.bypassSecurityTrustHtml(`${o.subject} ${o.desc}`);
              o.header = `<span class="font-weight-bold fs-px-14" title="${o.header_title}" style="pointer-events: none;">${o.subject}</span>&nbsp;`;
              o.header += `<span class="fs-px-12" title="${o.header_title}" style="pointer-events: none;">${o.desc}</span>`;
            } else if (o.subject) {
              o.header_title = this.sanitizer.bypassSecurityTrustHtml(`${o.subject}`);
              o.header = `<span class="font-weight-bold fs-px-14" title="${o.header_title}" style="pointer-events: none;">${o.subject}</span>`;
            } else if (o.desc) {
              o.header_title = this.sanitizer.bypassSecurityTrustHtml(`${o.desc}`);
              o.header = `<span class="fs-px-12" title="${o.header_title}" style="pointer-events: none;">${o.desc}</span>`;
            } else {
              o.header = '';
            }
            return o;
          });
          this.initDragNDrop();
        }
      });
  }

  updateMediaBook() {
    this.dialogCreateMediaBookRef = this.dialog.open(CreateMediaBookComponent, {
      width: '440px',
      height: '490px',
      disableClose: true,
      data: this.mediaBookObj
    });
    this.dialogCreateMediaBookRef.afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.getMediaBook();
        }
      });
  }

  async deleteMediaBookItem() {
    const getIdes: any[] = this.mediaBookItems.filter((o: any) => o.checked).map((o: any) => o._id);

    try {
      this.deleteDialog.delete('Are you sure you want to delete selected item(s)?')
        .then(async () => {
          this.updatedMediaBookItems();
          this.spinner.show();
          this.loading = true;
          await this.mediaBookItemsService.deleteMediaBookItem(this.mediaBookId, getIdes.toString());
          this.spinner.hide();
          this.loading = false;
        });
    } catch (e) {
      console.error('MediaBookItemsComponent -> deleteMediaBookItem', e);
    }
  }

  updatedMediaBookItems() {

    this.mediaBookItems.map((o: any) => {
      if (!o.checked) {
        this.actions = this.actions.map((a) => {
          a.disabled = a.name !== 'Actions';
          return a;
        });
      }
    });
  }

  copyToMediaBookItem() {
    try {
      this.copyToMediabookDialogRef = this.dialog.open(CopyToMediabookComponent, {
        disableClose: true,
        width: '600px',
        height: '700px',
        panelClass: 'copy-to-mediabook-dialog',
        data: {items: this.mediaBookItems.filter((o: any) => o.checked), mediaBookID: this.mediaBookId}
      });
      this.copyToMediabookDialogRef.afterClosed()
        .subscribe((res) => {
          if (!res) {
            this.checkboxChange();
          }
        });
    } catch (e) {
      console.error('MediaBookItemsComponent -> copyToMediaBookItem', e);
    }
  }

  shareMediaBookItem() {
    this.dialog.open(ShareMediaBookItemComponent, {
      disableClose: true,
      height: '380px',
      width: '400px',
      panelClass: 'share-mediabook-item-dialog',
      data: {items: this.mediaBookItems.filter((o: any) => o.checked), mediaBookID: this.mediaBookId}
    });
  }

  shareMediabook() {
    try {
      this.dialogShareMediaBookRef = this.dialog.open(ShareMediaBookComponent, {
        width: '500px',
        height: '510px',
        disableClose: true,
        data: this.mediaBookObj
      });
      this.dialogShareMediaBookRef.afterClosed()
        .subscribe(async (res) => {
          this.mediaBookItems.map((o: any) => {
            if (o.checked) {
              this.actions = this.actions.map((a) => {
                a.disabled = a.name === 'Actions';
                return a;
              });
            }
          });
          await this.mediaBookService.getMediaBook(this.mediaBookId);
        });
    } catch (e) {
      console.error('MediaBookItemsComponent -> shareMediabook', e);
    }
  }

  async updateMediaBookItem(itemId, bodyObj: any) {
    try {
      await this.mediaBookItemsService.updateMediaBookItem(this.mediaBookId, itemId, bodyObj);
    } catch (e) {
      console.error('MediaBookItemsComponent -> updateMediaBookItem', e);
    }
  }

  async setCover() {
    const getCoverId: any[] = this.mediaBookItems.filter((o: any) => o.checked).map(o => o._id);
    const index = this.mediaBookItems.map(i => i._id).indexOf(getCoverId[0]);
    moveItemInArray(this.mediaBookItems, index, 0);
    const ids = this.mediaBookItems.map(i => i._id);
    try {
      this.spinner.show();
      this.loading = true;
      await this.mediaBookItemsService.updateSequence(this.mediaBookId, this.mediaBookItems.map(i => i._id));
      await this.mediaBookService.setMediaBookCover(this.mediaBookId, {image: op.get(this.mediaBookItems, '0.ref_id')});
      this.spinner.hide();
      this.loading = false;
      this.actions = this.actions.map((o) => {
        o.disabled = o.name !== 'Actions';
        return o;
      });
      this.mediaBookItems = this.mediaBookItems.map((o: any) => {
        o.checked = false;
        return o;
      });
    } catch (e) {
      console.error('MediaBookItemsComponent -> Sequenceupdate', e);
    }
  }

  clickCount(image_id) {
    if (op.get(this.user, '_id')) {
      const data = {'image_id': image_id, 'user_id': this.user._id, 'duration': 0};
      this._mainService.clickImage(data);
    }
  }

  initDragNDrop() {
    if (this.mediaBookCreatorId === op.get(this.user, '_id')) {
      $(document).ready(() => {
        function getIdsOfImages(values) {
          $('.listitemClass').each(function (index) {
            const $this = this;
            values.push($($this).attr('id').replace('imageNo', ''));
          });
        }

        $(() => {
          let values;
          $('#imageListId').sortable({
            update: (event, ui) => {
              values = [];
              getIdsOfImages(values);
            }, // end update
            stop: (event, ui) => {
              if (values && values.length === this.mediaBookItems.length) {
                const mbi = values.map(ind => {
                  return this.mediaBookItems[parseInt(ind, 10)];
                });
                try {
                  this.mediaBookItemsService.updateSequence(this.mediaBookId, mbi.map(i => i._id));
                  this.mediaBookService.setMediaBookCover(this.mediaBookId, {image: op.get(mbi, '0.ref_id')});
                } catch (e) {
                  console.error('MediaBookItemsComponent -> Sequenceupdate', e);
                }
              }
            }
          });
        });
      });
    }
  }

  linkToMediaBook() {
    const filterMbItem: any = this.mediaBookItems.filter((o: any) => o.checked);
    this.linkToMediaBookService.openLinkToMediabookModal(this.mediaBookId, op.get(filterMbItem, '0._id'))
      .then((res) => {
        if (res) {
          this.pageNo = 1;
          this.getMediaBookItems();
        }
        this.mediaBookItems.map((o: any) => {
          if (o.checked) {
            this.actions = this.actions.map((a) => {
              a.disabled = a.name === 'Actions';
              return a;
            });
          }
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
