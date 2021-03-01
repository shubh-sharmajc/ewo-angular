import {Component, Input, OnInit} from '@angular/core';
import {RegistrationReminderService} from '../../../../modal/pro-modal/registration-reminder/registration-reminder.service';

@Component({
  selector: 'app-pro-listing',
  templateUrl: './pro-listing.component.html',
  styleUrls: ['./pro-listing.component.scss']
})
export class ProListingComponent implements OnInit {

  @Input() list;
  @Input() public business;
  @Input() public currentUser;
  public isLoggedIn = true;

  constructor(private registrationReminderDialogService: RegistrationReminderService) {
  }


  ngOnInit() {
    if (this.currentUser == null) {
      this.isLoggedIn = false;
    }
    if (this.currentUser && this.business && !this.business.is_complete) {
      this.registrationReminderDialogService.openRegistrationReminderModal();
    }
  }

  close() {
    this.isLoggedIn = (true);
  }
}
