import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material';

import {DeleteComponent} from './delete.component';
import {DeleteDialogService} from './delete-dialog.service';

@NgModule({
  declarations: [
    DeleteComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  exports: [
    DeleteComponent
  ],
  providers: [
    DeleteDialogService
  ],
  entryComponents: [
    DeleteComponent
  ]
})
export class DeleteDialogModule {
}
