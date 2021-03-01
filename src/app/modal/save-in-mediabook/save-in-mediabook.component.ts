import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntil} from 'rxjs/operators/index';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import * as op from 'object-path';

import {MediaBookService} from '../../_services/media-book/media-book.service';
import {MediaBookItemsService} from '../../_services/media-book-items/media-book-items.service';
import {AppState} from '../../app.state';
import {AlertDialogService} from '../alert/alert-dialog.service';
import {CreateMediaBookComponent} from '../../modules/media-books/create-media-book/create-media-book.component';

@Component({
  selector: 'app-save-in-mediabook',
  templateUrl: './save-in-mediabook.component.html',
  styleUrls: ['./save-in-mediabook.component.scss']
})
export class SaveInMediabookComponent implements OnInit, OnDestroy {

  public mediaBookList: any[] = [];
  public saveItemForm: FormGroup;
  public submitted: any = false;
  public showMoreText: any = false;
  public imageData: any;
  public media: any;
  public destroy$: any = new Subject<any>();
  public currentUser: any = {_id: null};
  public dialogCreateMediaBookRef: MatDialogRef<CreateMediaBookComponent>;

  constructor(private dialogRef: MatDialogRef<SaveInMediabookComponent>,
              private store: Store<AppState>,
              public dialog: MatDialog,
              private alertDialogService: AlertDialogService,
              private formBuilder: FormBuilder,
              public sanitizer: DomSanitizer,
              @Inject(MAT_DIALOG_DATA) public data,
              private mediaBookItemsService: MediaBookItemsService,
              private mediaBookService: MediaBookService) {
    this.createForm();
  }

  ngOnInit() {
    this.imageData = op.get(this.data, 'data');
    this.getLoginUser();
    this.getMediaBooks();
    if (this.data) {
      this.updateForm();
    }
  }

  createForm() {
    this.saveItemForm = this.formBuilder.group({
      mediabook: [null, Validators.required],
      notes: [''],
      subject: ['', Validators.required],
      desc: [''],
      image_url: [''],
      type: ['']
    });
  }

  updateForm() {
    if (this.imageData) {
      let subject = op.get(this.imageData, 'subject', '');
      const desc: any = op.get(this.imageData, 'description', '');
      const image_url: any = op.get(this.imageData, 'picture_thumb_url', '');
      let type: any = op.get(this.imageData, 'type', '');
      if (!subject) {
        subject = op.get(this.imageData, 'title');
      }
      if (!type && subject && desc) {
        type = 'XP';
      } else if (!type && subject) {
        type = 'IMG';
      }
      this.saveItemForm.patchValue({subject, desc, image_url, type});
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.saveItemForm.controls;
  }

  async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }

    // stop here if form is invalid
    if (this.saveItemForm.invalid) {
      return;
    }

    try {
      const fd: any = this.saveItemForm.getRawValue();
      const body: any = {};
      body.notes = fd.notes;
      body.subject = fd.subject;
      body.desc = fd.desc;
      body.image_url = fd.image_url;
      body.type = fd.type;
      body.ref_id = op.get(this.imageData, '_id', '');
      if (op.get(this.imageData, 'content', '')) {
        body.content = op.get(this.imageData, 'content', '');
      }
      await this.mediaBookItemsService.createMediaBookItem(fd.mediabook, body);
      this.closeDialog();
    } catch (e) {
      this.alertDialogService.alert('This item is already in the specified Mediabook. ' +
        'Please select a different item or save to a different Mediabook.');
      console.log('SaveInMediabookComponent -> onSubmit ::: ', e);
    }
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
          o.shared = op.get(o, 'created_by._id') !== op.get(this.currentUser, '_id');
          o.sharingAccess = o.sharing.find((s: any) => op.get(s, 'user._id') === op.get(this.currentUser, '_id'));
          return o;
        })
        .filter((o) => {
          if (o.shared) {
            return o.shared && o.private && o.sharingAccess.access;
          } else {
            return o.name !== 'Uploaded Items' && o.name !== 'About Us';
          }
        });
      if (this.mediaBookList.length < 11) {
        this.mediaBookList.unshift({name: 'Create new mediabook'});
        this.mediaBookList.filter((item) => {
          if (item.name === 'Create new mediabook') {
            this.media = item;
          }
        });
      }

    } catch (e) {
      console.log('SaveInMediabookComponent -> getMediaBooks ::: ', e);
    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  createNewMediabook() {
    this.dialogCreateMediaBookRef = this.dialog.open(CreateMediaBookComponent, {
      width: '440px',
      height: '490px',
      disableClose: true,
    });
    this.dialogCreateMediaBookRef.afterClosed()
      .subscribe((res: any) => {
        this.getMediaBooks();
      });
  }

  menuChange($event: any) {
    if ($event.name === 'Create new mediabook') {
      this.createNewMediabook();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
