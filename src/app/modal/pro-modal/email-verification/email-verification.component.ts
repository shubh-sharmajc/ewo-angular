import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-media-book',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  public title: string;
  public role: string;
  public data: any[] = [];
  constructor(public bsModalRef: BsModalRef) {

  }

  ngOnInit() {

  }
}
