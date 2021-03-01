import {Component, Input, OnInit} from '@angular/core';

import {CredentialsService} from '../../../../modal/pro-modal/credentials/credentials.service';

@Component({
  selector: 'app-staff-bias',
  templateUrl: './staff-bias.component.html',
  styleUrls: ['./staff-bias.component.scss']
})
export class StaffBiasComponent implements OnInit {

  @Input() editUser: any;

  constructor(private credentialsService: CredentialsService) {
  }

  ngOnInit() {
  }

  openAddCredentialsPopup() {
    this.credentialsService.openAddCedentialsModal();
  }

}
