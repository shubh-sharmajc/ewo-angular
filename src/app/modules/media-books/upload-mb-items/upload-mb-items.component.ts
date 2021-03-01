import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators/index';
import * as op from 'object-path';
import * as _ from 'lodash';

import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';
import {UploadImageService} from '../../../_services/upload-image/upload-image.service';
import {PRO_USER_ROLES, SpaceValidator} from '../../../constant';
import {AppState} from '../../../app.state';
import {Subject} from 'rxjs';
import {GetMediaBookItemListAction} from '../../../store/actions/media-book-action';


@Component({
  selector: 'app-upload-mb-items',
  templateUrl: './upload-mb-items.component.html',
  styleUrls: ['./upload-mb-items.component.scss']
})
export class UploadMbItemsComponent implements OnInit, OnDestroy {

  public uploadMbItemsForm: FormGroup;
  public mediaBookId: any;
  public selectedImg: any = -1;
  public progress: any = 0;
  public user: any;
  public destroy$: any = new Subject<any>();
  public proUserRoles: any = PRO_USER_ROLES;
  public pageNo: any = 1;

  constructor(private store: Store<AppState>,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private uploadImageService: UploadImageService,
              private mediaBookItemsService: MediaBookItemsService) {
    this.activatedRoute.params.subscribe(async (params) => {
      this.mediaBookId = params.id;
    });
  }

  ngOnInit() {
    this.createForm();
    this.getUserByUserName();
    this.getMediaBookItems();
  }

  private getUserByUserName() {
    this.store.select('user')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.user && res.user.data) {
          this.user = res.user.data;
        }
      });
  }

  async getMediaBookItems() {
    try {
      const qp: any = {type: 'IMG,XP', stagingonly: 1};
      await this.mediaBookItemsService.getMediaBookItemList(this.mediaBookId, qp, this.pageNo, true);
    } catch (e) {
      console.error('MediaBookItemsComponent -> getMediaBookItems', e);
    }
    this.store.select('mediaBook')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        const mediaBookItems: any = op.get(res, 'mediaBookItemList');
        if (mediaBookItems) {
          this.updateMBItemForm(mediaBookItems);
        }
      });
  }

  async updateMBItemForm(mediaBookItems) {
    // Clear form array
    for (let i = this.mbItems.length - 1; i >= 0; i--) {
      this.mbItems.removeAt(i);
    }
    if (mediaBookItems.length) {
      const mbItems = await Promise.all(_.map(mediaBookItems, async (o) => {
        return await this.createMbItem(o);
      }));
      for (const mbItem of mbItems) {
        this.mbItems.push(mbItem);
      }
    }
    if (this.mbItems.value.length) {
      this.selectedImg = 0;
      this.mbItems.markAsPristine();
    }
  }

  private async createMbItem(mbItem?: any, file?: any) {
    const newMbItem: any = {};
    newMbItem._id = op.get(mbItem, '_id', Date.now());
    newMbItem.active = op.get(mbItem, 'active', true);
    newMbItem.type = op.get(mbItem, 'type', 'IMG');
    newMbItem.desc = op.get(mbItem, 'desc', '');
    newMbItem.uploaded = op.get(mbItem, 'uploaded', false);
    newMbItem.seq = op.get(mbItem, 'seq', 0);
    newMbItem.shares = op.get(mbItem, 'shares', []);
    newMbItem.ref_id = op.get(mbItem, 'ref_id', '');
    newMbItem.created_by = op.get(mbItem, 'created_by', '');
    newMbItem.mediabook = op.get(mbItem, 'mediabook', '');
    newMbItem.sharing = op.get(mbItem, 'sharing', []);
    newMbItem.created = op.get(mbItem, 'created', Date.now());
    newMbItem.updated = op.get(mbItem, 'updated', Date.now());
    newMbItem.subject = [op.get(mbItem, 'subject', ''), [Validators.required, SpaceValidator.cannotContainSpace]];
    newMbItem.description = [op.get(mbItem, 'description', ''), [Validators.required, SpaceValidator.cannotContainSpace]];
    newMbItem.tags = [op.get(mbItem, 'tags', '')];
    if (file) {
      newMbItem.file = file;
      newMbItem.image_url = await this.toBase64(file);
    } else {
      newMbItem.image_url = op.get(mbItem, 'image_url', null);
    }
    return this.formBuilder.group(newMbItem);
  }

  public move(n: any) {
    this.updateMediaBookItem();
    this.slideImage(this.selectedImg += n);
  }

  public slideImage(n) {
    const mbItems: any = this.mbItems.value;
    const mbiLen: any = mbItems.length - 1;
    if (n > mbiLen) {
      this.selectedImg = 0;
    }
    if (n < 0) {
      this.selectedImg = mbiLen;
    }
  }

  public goBack() {
    const URL_PREFIX = PRO_USER_ROLES.indexOf(this.user.role) > -1 ? '/pro/manage-media/' : '/user/';
    this.router.navigate([`${URL_PREFIX}${this.user.username}/mediabooks/${this.mediaBookId}/items`]);
  }

  public goToManageMBSequence() {
    const URL_PREFIX = PRO_USER_ROLES.indexOf(this.user.role) > -1 ? '/pro/manage-media/' : '/user/';
    this.router.navigate([`${URL_PREFIX}${this.user.username}/mediabooks/${this.mediaBookId}/mb-sequence`]);
  }

  public createForm() {
    this.uploadMbItemsForm = this.formBuilder.group({
      mbItems: this.formBuilder.array([])
    });
  }

  get mbItems(): any {
    return this.uploadMbItemsForm.get('mbItems') as any;
  }

  public getUploadImage() {
    if (document.getElementById('getUploadImageFile')) {
      document.getElementById('getUploadImageFile').click();
    }
  }

  public getUploadingImage() {
    if (document.getElementById('getUploadingImageFile')) {
      document.getElementById('getUploadingImageFile').click();
    }
  }

  public toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  public async fileChange(event) {
    try {
      const files: any = event.target.files;
      if (files) {
        const mbItems = await Promise.all(_.map(_.values(files), async (file, i) => {
          return await this.createMbItem({}, file);
        }));
        for (const mbItem of mbItems) {
          this.mbItems.push(mbItem);
        }
      }
      await this.recursiveMBItems();
    } catch (e) {
      console.error('UploadMbItemsComponent -> fileChange ::: ', e);
    }

  }

  async removeMultipleMbItem() {
    try {
      const mbItemIDs: any = _.map(this.mbItems.value, (o: any) => {
        const VALID: any = (new Date(o._id)).getTime() > 0;
        return !VALID ? o._id : '';
      }).filter((o: any) => o);
      if (mbItemIDs.length) {
        await this.mediaBookItemsService.deleteMediaBookItem(this.mediaBookId, mbItemIDs.join());
      }
      this.goBack();
    } catch (e) {
      console.error('UploadMbItemsComponent -> removeMultipleMbItem ::: ', e);
    }
  }

  async removeMbItem(intIndex, itemID) {
    const VALID: any = (new Date(itemID)).getTime() > 0;
    if (!VALID) {
      await this.mediaBookItemsService.deleteMediaBookItem(this.mediaBookId, itemID);
    }
    this.mbItems.removeAt(intIndex);
    if (!this.mbItems.value.length) {
      this.selectedImg = -1;
    }
  }

  async updateMediaBookItem() {
    try {
      const mbItem: any = this.mbItems.at(this.selectedImg).value;
      const body: any = {};
      body.subject = mbItem.subject;
      body.desc = mbItem.description;
      body.tags = mbItem.tags;
      return await this.mediaBookItemsService.updateMediaBookItem(this.mediaBookId, mbItem._id, body);
    } catch (e) {
      console.error('UploadMbItemsComponent -> updateMediaBookItem ::: ', e);
    }
  }

  async createMediaBookItem(img: any) {
    try {
      const body: any = {};
      body.notes = '';
      body.subject = img.subject;
      body.desc = img.description;
      body.image_url = img.url;
      body.type = 'XP';
      body.ref_id = img.image_id;
      return await this.mediaBookItemsService.createMediaBookItem(this.mediaBookId, body);
    } catch (e) {
      console.error('UploadMbItemsComponent -> createMediaBookItem ::: ', e);
    }
  }

  async uploadMediaBookImage(file: any) {
    const current: any = new Date();
    const timestamp: any = current.getTime();
    const fd = new FormData();
    const fileName = file.name.split('.')[0];
    const ext = file.name.split('.')[1];
    const filename = `${fileName}_${timestamp}.${ext}`;
    fd.append(`filename[${file.name}]`, filename);
    fd.append('file[]', file);
    return await this.uploadImageService.uploadMediaBookImage(fd);
  }

  async recursiveMBItems() {
    let intIndex: any = 0;
    const mbItems: any = this.mbItems.value;
    const mbiLen: any = mbItems.length - 1;
    const singleImgProgress: any = {};
    this.uploadImageService.progress.subscribe(value => {
      singleImgProgress[intIndex] = value;
      this.progress = _.sum(Object.values(singleImgProgress));
    });
    const createMBItems = async () => {
      try {
        const file: any = op.get(mbItems[intIndex], 'file');
        if (file) {
          const imgRes: any = await this.uploadMediaBookImage(file);
          const status: any = op.get(imgRes, 'status');
          if (status === 'success') {
            const files: any = op.get(imgRes, 'files');
            const res: any = await this.createMediaBookItem(op.get(files, '0'));
            if (op.get(res, 'status') === 'success') {
              this.mbItems.at(intIndex).patchValue(op.get(res, 'data'));
            }
          }
        }
      } catch (e) {
        console.error('UploadMbItemsComponent -> recursiveMBItems ::: ', e);
      }
      if (intIndex < mbiLen) {
        intIndex++;
        await createMBItems();
      }
    };
    await createMBItems();
    this.progress = 0;
    this.selectedImg = this.selectedImg === -1 ? 0 : this.selectedImg;
    this.store.dispatch(new GetMediaBookItemListAction({data: op.get(this.mbItems, 'value', []), resetState: true}));
  }

  async onSubmit() {
    await this.updateMediaBookItem();
    this.goToManageMBSequence();
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
