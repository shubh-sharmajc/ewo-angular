import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-warning-reminder',
  templateUrl: './warning-reminder.component.html',
  styleUrls: ['./warning-reminder.component.scss']
})
export class WarningReminderComponent implements OnInit {

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
