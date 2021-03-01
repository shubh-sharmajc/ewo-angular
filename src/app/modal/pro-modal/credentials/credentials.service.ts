import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CredentialsComponent} from './credentials.component';

@Injectable()
export class CredentialsService {

  private bsModalRef: BsModalRef;

  constructor(public dialog: MatDialog, private modalService: BsModalService) {
  }

  openAddCedentialsModal() {
    this.bsModalRef = this.modalService.show(CredentialsComponent, Object.assign({}, { class: 'gray modal-xl' }));
  }

}
