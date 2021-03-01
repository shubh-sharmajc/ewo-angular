import {Injectable} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {AccountDowngradeComponent} from './account-downgrade.component';

@Injectable()
export class AccountDowngradeService {

  private bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService) {
  }

  openModal() {
    return new Promise((resolve) => {
      this.bsModalRef = this.modalService.show(AccountDowngradeComponent, {class: 'gray modal-lg'});
      this.bsModalRef.content.onClose
        .subscribe((result) => {
          return resolve(result);
        });
    });

  }
}
