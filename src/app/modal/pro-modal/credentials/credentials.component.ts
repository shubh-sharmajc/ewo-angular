import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  isEducationCollapsed = false;
  isPersonalAffiliationCollapsed = true;
  isAwardsCollapsed = true;

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
  }
}
