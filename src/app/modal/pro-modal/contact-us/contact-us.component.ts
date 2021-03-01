import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  title: string;
  data: any[] = [];
  constructor(public bsModalRef: BsModalRef) {

  }

  ngOnInit() {

  }
}
