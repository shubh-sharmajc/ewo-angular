import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-create-media-book',
  templateUrl: './pause-registration.component.html',
  styleUrls: ['./pause-registration.component.scss']
})
export class PauseRegistrationComponent implements OnInit {

  public onClose: Subject<any>;

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  public onConfirm(): void {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
