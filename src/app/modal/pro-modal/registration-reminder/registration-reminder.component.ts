import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-registration-reminder',
  templateUrl: './registration-reminder.component.html',
  styleUrls: ['./registration-reminder.component.scss']
})
export class RegistrationReminderComponent implements OnInit {

  public onClose: Subject<any>;

  constructor(public bsModalRef: BsModalRef, private router: Router) {
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  resumeRegistration() {
    this.router.navigate(['/pro/resume-registration']);
    this.onConfirm();
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
