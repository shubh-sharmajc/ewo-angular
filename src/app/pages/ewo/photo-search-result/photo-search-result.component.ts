import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {isPlatformBrowser} from '@angular/common';
import {Store} from '@ngrx/store';
import {MatDialog} from '@angular/material';
import {Subscription} from 'rxjs';
import {InViewportMetadata} from 'ng-in-viewport';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';

import {MainService} from '../../../_services/main.service';
import {SaveInMediabookDialogService} from '../../../modal/save-in-mediabook/save-in-mediabook-dialog.service';
import {ShareViaEmailDialogService} from '../../../modal/share-via-email/share-via-email-dialog.service';
import {environment} from '../../../../environments/environment';
import {AppState} from '../../../app.state';
import {ImageGalleryService} from '../../../_services/image-gallery/image-gallery.service';
import {AlertDialogService} from '../../../modal/alert/alert-dialog.service';

@Component({
  selector: 'app-photo-search-result',
  templateUrl: './photo-search-result.component.html',
  styleUrls: ['./photo-search-result.component.scss']
})
export class PhotoSearchResultComponent implements OnInit {

  public imageList: any = [];
  public imageCounter = 0;
  public promotionCounter = 0;
  public bannerCounter = 0;
  public endImage = 0;
  public scrollCounter = 0;
  public scrollEnable = true;
  public currentUser: any;
  public sub_currentUser: Subscription;
  public count_sec = 0;
  public alive = false;
  public ramdon_no = 0;
  public searchStr = '';
  public WP_STORIES_LINK = `${environment.WP_STORIES_LINK}`;
  public disable = false;

  constructor(public sanitizer: DomSanitizer,
              @Inject(PLATFORM_ID) private platformId,
              private store: Store<AppState>,
              private shareViaEmailDialogService: ShareViaEmailDialogService,
              private imageGalleryService: ImageGalleryService,
              public dialog: MatDialog,
              public alertDialogService: AlertDialogService,
              private route: ActivatedRoute,
              private _mainService: MainService,
              public saveInMediabookDialog: SaveInMediabookDialogService) {
    this.ramdon_no = (Math.floor(Math.random() * 16) + 1);
  }

  ngOnInit() {
    this.loginData();
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
    let searchStr = '';
    this.route.queryParams.subscribe(params => {
      searchStr = params['search'];
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
      this.imageList = [];
      this.imageCounter = 0;
      this.promotionCounter = 0;
      this.bannerCounter = 0;
      this.endImage = 0;
      this.scrollCounter = 0;
      if (searchStr != this.searchStr && searchStr) {
        this.searchStr = searchStr;
        this.imageData();
      } else {
        this.searchStr = '';
        this.imageData();
      }
    });
  }

  imageData() {
    this.scrollEnable = false;

    let data = {
      imageCounter: this.imageCounter,
      promotionCounter: this.promotionCounter,
      bannerCounter: this.bannerCounter,
      user_id: this.currentUser ? this.currentUser._id : '0',
      ramdon_no: this.ramdon_no,
      searchStr: this.searchStr
    };
    this._mainService.loadMoreImages(data)
      .subscribe((res) => {
          let imageList = res;
          if ((Number(imageList.imageData.length) === 0) && (Number(imageList.promotionData.length) === 0) && (Number(imageList.bannerData.length) === 0)) {
            this.endImage = 1;
          }
          this.promotionCounter += imageList.promotionData.length;
          this.imageCounter += imageList.imageData.length;
          if ((imageList.imageData && imageList.imageData.length > 0) || (imageList.promotionData && imageList.promotionData.length > 0) || (imageList.bannerData && imageList.bannerData.length > 0)) {
            let imageData = [];
            let promotionData = [];
            let row = 0;
            let lastKey = -1;
            imageData[row] = [];
            imageData[row]['data'] = [];
            let resImgData = imageList.imageData.map(x => Object.assign({}, x));
            let organicLastKey = imageList.imageData.length - 1;
            if (imageList.imageData.length > 0) {
              resImgData.forEach((element, key) => {
                if (Number(imageData[row]['data'].length) >= 3) {
                  row++;
                  imageData[row] = [];
                  imageData[row]['data'] = [];
                }
                element.time_stamp = new Date(element.created).getTime();
                imageData[row]['data'].push(element);

                if (Number(imageList.promotionData.length) > 0) {
                  imageList.promotionData.forEach((element1, key1) => {
                    if ((Number(imageData[row]['data'].length) < 3) && (key1 > lastKey)) {
                      element1.time_stamp = new Date(element1.created).getTime();
                      imageData[row]['data'].push(element1);
                      lastKey = key1;
                    } else if (organicLastKey === key && (key1 > lastKey)) {
                      if (Number(imageData[row]['data'].length) >= 3) {
                        row++;
                        imageData[row] = [];
                        imageData[row]['data'] = [];
                      }

                      element1.time_stamp = new Date(element1.created).getTime();
                      imageData[row]['data'].push(element1);
                      lastKey = key1;
                    }
                  });
                }

              });
            } else {
              let resImgData1 = imageList.promotionData.map(x => Object.assign({}, x));
              resImgData1.forEach((element, key) => {
                if (Number(imageData[row]['data'].length) >= 3) {
                  row++;
                  imageData[row] = [];
                  imageData[row]['data'] = [];
                }
                element.time_stamp = new Date(element.created).getTime();
                imageData[row]['data'].push(element);

              });
            }
            this.imageList = this.imageList.concat(imageData);
            //console.log(this.imageList)

            let row1 = 0;
            let bannerData = [];
            bannerData[row1] = [];
            bannerData[row1]['data'] = [];
            let banner = imageList.bannerData.map(x => Object.assign({}, x));
            if ((banner && banner.length > 0)) {
              banner.forEach((element1, key1) => {
                this.bannerCounter++;
                element1.time_stamp = new Date(element1.created).getTime();
                bannerData[row1]['data'].push(element1);
                row1++;
              });
              this.imageList = this.imageList.concat(bannerData);
            }
          } else {
            this.endImage = 1;
          }
          this.scrollEnable = true;
        }
      );
  }

  loginData() {
    this.sub_currentUser = this.store.select('loginUser')
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  ngOnDestroy() {
    if (this.sub_currentUser) {
      this.sub_currentUser.unsubscribe();
    }
  }

  public sanitizeImage(image: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${image}')`);
  }

  highlightTile(event, image_id) {
    const {[InViewportMetadata]: {entry}, target, visible} = event;
    if (visible && this.currentUser) {
      const data = {'image_id': image_id, 'user_id': this.currentUser._id, 'type': 'image'};
      this._mainService.viewImage(data);
    }
  }

  countClick(image_id) {
    if (this.currentUser && this.currentUser._id) {
      const data = {'image_id': image_id, 'user_id': this.currentUser._id, 'duration': 0};
      this._mainService.clickImage(data);
    }
  }

  async toggleLike(elem: any, rec: any) {
    if (this.currentUser) {
      this.disable = true;
      try {
        if (elem.srcElement.className.includes('green')) {
          const res = await this._mainService.likeFlagImage({
            user_id: this.currentUser._id,
            image_id: rec._id,
            is_like: false,
            is_flag: false,
            api_type: 'like'
          });
          rec.total_like--;
          if (res) {
            this.disable = false;
          }
          elem.srcElement.classList.remove('green');
        } else {
          const res = await this._mainService.likeFlagImage({
            user_id: this.currentUser._id,
            image_id: rec._id,
            is_like: true,
            is_flag: false,
            api_type: 'like'
          });
          if (res) {
            this.disable = false;
          }
          elem.srcElement.classList.add('green');
          rec.total_like++;
        }
      } catch (e) {
        this.disable = false;
      }
    }
  }

  stopModalBox(event: any) {
    event.stopPropagation();
  }

  savePhoto(event: any, imageObj: any) {
    if (this.currentUser) {
      this.saveInMediabookDialog.openModal(imageObj);
    }
  }

  shareViaEmail(event: any, imageObj: any) {
    if (this.currentUser) {
      this.shareViaEmailDialogService.share(imageObj).then(async (res) => {
        try {
          await this.imageGalleryService.shareViaEmail(imageObj._id, res);
          this.alertDialogService.alert('Email sent successfully.');
        } catch (e) {
          this.alertDialogService.alert('Email not sent.');
          console.log('PhotoSearchResultComponent -> shareViaEmail :: ', e);
        }
      });
    }
  }

}
