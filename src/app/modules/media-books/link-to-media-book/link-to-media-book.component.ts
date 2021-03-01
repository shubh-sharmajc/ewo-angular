import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators/index';
import * as _ from 'lodash';
import * as op from 'object-path';

import {MediaBookService} from '../../../_services/media-book/media-book.service';
import {AppState} from '../../../app.state';
import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';

@Component({
  selector: 'app-link-to-media-book',
  templateUrl: './link-to-media-book.component.html',
  styleUrls: ['./link-to-media-book.component.scss']
})
export class LinkToMediaBookComponent implements OnInit, OnDestroy {

  public linkToMediabookForm: FormGroup;
  public onClose: Subject<any> = new Subject<any>();
  public mediaBookList: any[] = [];
  public destroy$: any = new Subject<any>();
  public currentUser: any;
  public submitted: any = false;
  public mediaBookId: any = false;
  public mbItemId: any = false;
  modal = false;
  public vanityLinkText = '';
  public enableMedia: boolean=true;
  mediabook = '';

  constructor(private formBuilder: FormBuilder,
              public bsModalRef: BsModalRef,
              private store: Store<AppState>,
              private mediaBookService: MediaBookService,
              private mediaBookItemsService: MediaBookItemsService,) {
  }

  ngOnInit() {
    this.createForm();
    this.getLoginUser();
    this.getMediaBooks();
    if(this.enableMedia){
      this.mb.controls.name.disable();
    }
  }

  doneButton(){
    if(this.vanityLinkText == ''){
        this.submitted = true;
        console.log(this.vanityLinkText)
    }else{
      this.submitted = true;
      this.modal = true
      console.log(this.vanityLinkText)
    }
  }

  createForm() {
    this.linkToMediabookForm = this.formBuilder.group({
      mediabookId: new FormGroup({
        _id: new FormControl(['']),
        name: new FormControl([''])
      }),
      name: ['', []],
    });
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  onSelectMb(event: any): void {
    if (event && event.item) {
      this.linkToMediabookForm.patchValue({mediabookId: {_id: event.item._id, name: event.item.name}});
    }
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
            return o.name !== 'Uploaded Items' && o._id !== this.mediaBookId;
          }
        });
    } catch (e) {
      console.log('LinkToMediaBookComponent -> getMediaBooks ::: ', e);
    }
  }

  get f() {
    return this.linkToMediabookForm.controls;
  }

  get mb(): any {
    return this.linkToMediabookForm.get('mediabookId') as any;
  }

  enableMediabook(value){
    if(value==true){
      this.enableMedia=false;
      this.mb.controls.name.enable();
    }else{
      this.enableMedia=true;
      this.mb.controls.name.disable();
    }
  }

  async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }

    // stop here if form is invalid
    if (this.linkToMediabookForm.invalid) {
      return;
    }

    const fd: any = this.linkToMediabookForm.getRawValue();
    const payload: any = {};
    payload.mediabookId = op.get(fd, 'mediabookId._id');
    // payload.name = op.get(fd, 'name');
    payload.name = this.vanityLinkText;
    console.log(payload);
    if (payload.mediabookId && payload.name) {
      await this.mediaBookItemsService.linkToMediaBook(this.mediaBookId, this.mbItemId, payload);
      this.onClose.next(true);
      this.bsModalRef.hide();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
