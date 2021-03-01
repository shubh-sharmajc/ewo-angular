import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {ScrollEvent} from 'ngx-scroll-event';
import * as _ from 'lodash';

import {MediaBookItemsService} from '../../../_services/media-book-items/media-book-items.service';
import {MediaBookService} from '../../../_services/media-book/media-book.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-media-book-items-view',
  templateUrl: './media-book-items-view.component.html',
  styleUrls: ['./media-book-items-view.component.scss']
})
export class MediaBookItemsViewComponent implements OnInit, OnDestroy {

  public filterByArr: any = [{name: 'Show All', value: ''},
    {name: 'Pro profiles', value: 'PRO'},
    {name: 'Images', value: 'XP,IMG'},
    {name: 'Stories', value: 'ST'}];
  public selectedFilterBy: any;
  public mediaBookId: any;
  public mediaBookObj: any;
  public mediaBookItems: any[];
  public destroy$: any = new Subject<any>();
  public authToken: any;
  public pageNo: any = 1;
  public isScrollChange: any = false;
  public WP_STORIES_LINK = `${environment.WP_STORIES_LINK}`;

  constructor(private store: Store<any>,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private mediaBookService: MediaBookService,
              private mediaBookItemsService: MediaBookItemsService) {
    this.activatedRoute.params.subscribe((params) => {
      this.mediaBookId = params.id;
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.authToken = params.auth;
    });
  }

  ngOnInit() {
    if (this.mediaBookId && this.authToken) {
      this.getSharedMediaBookItemList();
    } else {
      this.router.navigate(['/']);
    }
  }

  async changeFilterBy() {
    this.pageNo = 1;
    await this.mediaBookItemsService.getSharedMediaBookItemList(this.mediaBookId, this.authToken, this.pageNo, this.selectedFilterBy, true);
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

  async getSharedMediaBookItemList(type?: any) {
    this.store.select('mediaBook')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (_.isObject(res) && _.isObject(res.sharedMB)) {
          if (_.isArray(res.sharedMB.data)) {
            this.mediaBookItems = res.sharedMB.data.map((o) => {
              if (o.subject && o.desc) {
                o.header = `(${o.subject}) ${o.desc}`;
              } else if (o.subject) {
                o.header = `(${o.subject})`;
              } else if (o.desc) {
                o.header = `${o.desc}`;
              } else {
                o.header = '';
              }
              return o;
            });
          }
          if (_.isObject(res.sharedMB.mediabook)) {
            this.mediaBookObj = res.sharedMB.mediabook;
            this.mediaBookObj.shareCount = 0;
            if (_.isArray(this.mediaBookObj.sharing)) {
              this.mediaBookObj.shareCount += this.mediaBookObj.sharing.length;
            }
            if (_.isArray(this.mediaBookObj.shares)) {
              this.mediaBookObj.shareCount += this.mediaBookObj.shares.length;
            }
          }
        }
      });
    try {
      await this.mediaBookItemsService.getSharedMediaBookItemList(this.mediaBookId, this.authToken, this.pageNo, type, true);
    } catch (e) {
      console.error('MediaBookItemsComponent -> getSharedMediaBookItemList', e);
    }
  }

  async scrollHandler($event: ScrollEvent, type?: any) {
    if ($event.isReachingBottom && !this.isScrollChange) {
      this.isScrollChange = true;
      this.pageNo++;
      const resp: any = await this.mediaBookItemsService.getSharedMediaBookItemList(this.mediaBookId, this.authToken, this.pageNo, type);
      if (resp && resp.data && !resp.data.length) {
        this.isScrollChange = true;
      } else {
        this.isScrollChange = false;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
