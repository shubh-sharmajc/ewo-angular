import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';

import {AccountDowngradeComponent} from './account-downgrade.component';
import {AccountDowngradeService} from './account-downgrade.service';

@NgModule({
  declarations: [AccountDowngradeComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  exports: [AccountDowngradeComponent],
  entryComponents: [AccountDowngradeComponent],
  providers: [AccountDowngradeService]
})
export class AccountDowngradeModule {
}
