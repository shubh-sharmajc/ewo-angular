import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntil} from 'rxjs/operators/index';
import {Subject} from 'rxjs';
import * as _ from 'lodash';

import {MediaBookService} from '../../../_services/media-book/media-book.service';
import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';
import {AppState} from '../../../app.state';
import {CreateMediaBookComponent} from '../create-media-book/create-media-book.component';

@Component({
  selector: 'app-copy-to-mediabook',
  templateUrl: './copy-to-mediabook.component.html',
  styleUrls: ['./copy-to-mediabook.component.scss']
})
export class CopyToMediabookComponent implements OnInit, OnDestroy {

  public mediaBookList: any[] = [];
  public mbObj: any = {};
  public submitted: any = false;
  public imageData: any;
  public mediaBookID: any;
  public index = 0;
  public currentUser: any = {_id: null};
  public destroy$: any = new Subject<any>();
  public dialogCreateMediaBookRef: MatDialogRef<CreateMediaBookComponent>;

  constructor(private dialogRef: MatDialogRef<CopyToMediabookComponent>,
              public sanitizer: DomSanitizer,
              public dialog: MatDialog,
              private store: Store<AppState>,
              @Inject(MAT_DIALOG_DATA) public data,
              private mediaBookItemsService: MediaBookItemsService,
              private mediaBookService: MediaBookService) {
  }

  ngOnInit() {
    this.mbObj.mediaBookID = null;
    this.mbObj.items = JSON.parse(JSON.stringify(this.data.items));
    this.getLoginUser();
    this.getMediaBooks();
    this.mediaBookID = this.data.mediaBookID;
  }

  indexChanged() {
    this.mbObj.items.map((o: any) => {
      o.showMoreText = false;
      return o;
    });
  }

  async onSubmit(copyToMBIForm) {
    // stop here if form is invalid
    if (copyToMBIForm.form.invalid) {
      return;
    }
    const mediaBookItemObj: any = {
      mediabookId: this.mbObj.mediaBookID,
      items: this.mbObj.items.filter((o: any) => o.checked).map((o: any) => {
        return {_id: o._id, notes: o.notes};
      })
    };
    await this.mediaBookItemsService.copyToMediaBook(this.mediaBookID, mediaBookItemObj);
    this.closeDialog();
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  async getMediaBooks() {
    try {
      const resp: any = await this.mediaBookService.getMediaBookList();
      this.mediaBookList = resp.data
        .map((o: any) => {
          o.shared = o.created_by._id !== this.currentUser._id;
          o.sharingAccess = o.sharing.find((s: any) => s.user && s.user._id === this.currentUser._id);
          return o;
        })
        .filter((o) => {
          if (o.shared) {
            return o.shared && o.private && o.sharingAccess.access;
          } else {
            return o.name !== 'Uploaded Items';
          }
        });
      this.updateActionMenu(resp.data.length);
    } catch (e) {
      console.log('CopyToMediabookComponent -> getMediaBooks ::: ', e);
    }
  }

  updateActionMenu(mbTot: any) {
    if (mbTot < 10) {
      this.mediaBookList.unshift({name: 'Create new mediabook'});
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

  createNewMediabook() {
    this.dialogCreateMediaBookRef = this.dialog.open(CreateMediaBookComponent, {
      width: '440px',
      height: '490px',
      disableClose: true,
    });
    this.dialogCreateMediaBookRef.afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.mbObj.mediaBookID = res.data._id;
        }
        this.getMediaBooks();
      });
  }

  menuChange($event: any) {
    if ($event.name === 'Create new mediabook') {
      this.createNewMediabook();
    }
  }
}
