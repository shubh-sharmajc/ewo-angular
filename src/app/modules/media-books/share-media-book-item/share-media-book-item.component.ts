import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-share-media-book-item',
  templateUrl: './share-media-book-item.component.html',
  styleUrls: ['./share-media-book-item.component.scss']
})
export class ShareMediaBookItemComponent implements OnInit {

  public submitted: any = false;
  public imgObj: any;
  public imgObjType: any;
  public url: any = '';
  public title: any;

  constructor(private formBuilder: FormBuilder, private router: Router,
              private dialogRef: MatDialogRef<ShareMediaBookItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    this.data.items.filter((o: any) => o.checked).map((o: any) => {
      this.imgObj = {_id: o._id, title: o.title, subject: o.subject};
      this.imgObjType = o.type;
    });
    this.title = this.imgObj.subject ? this.imgObj.subject : this.imgObj.title;
    console.log('this.data.items', this.data.items)
  }

  facebook() {
    this.url = `https://www.facebook.com/sharer/sharer.php?u=${environment.SITE_URL}${this.router.url}&t=${this.title}`;
    window.open(this.url, 'FACEBOOK', 'height=500,width=500');
    this.closeDialog();
  }

  tweet() {
    this.url = `https://twitter.com/intent/tweet?u=${environment.SITE_URL}${this.router.url}&t=${this.title}`;
    window.open(this.url, 'TWEET', 'height=500,width=500');
    this.closeDialog();
  }

  linkedIn() {
    this.url = `https://www.linkedin.com/shareArticle?u=${environment.SITE_URL}${this.router.url}&t=${this.title}`;
    window.open(this.url, 'LINKEDIN', 'height=500,width=500');
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
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
}
