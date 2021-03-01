import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';

import {ShareViaEmailDialogService} from './share-via-email-dialog.service';
import {ShareViaEmailComponent} from './share-via-email.component';
import {ShareViaEmailSuccessComponent} from './share-via-email-success/share-via-email-success.component';

@NgModule({
  declarations: [
    ShareViaEmailComponent,
    ShareViaEmailSuccessComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ShareViaEmailComponent,
    ShareViaEmailSuccessComponent
  ],
  providers: [
    ShareViaEmailDialogService
  ],
  entryComponents: [
    ShareViaEmailComponent,
    ShareViaEmailSuccessComponent
  ]
})
export class ShareViaEmailDialogModule {
}
