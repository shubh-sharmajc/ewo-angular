import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DragAndDropDirective} from './drag-and-drop/drag-and-drop.directive';
import {MBUploadDragAndDropDirective} from './mbupload-drag-and-drop/mbupload-drag-and-drop.directive';

@NgModule({
  declarations: [
    DragAndDropDirective,
    MBUploadDragAndDropDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DragAndDropDirective,
    MBUploadDragAndDropDirective]
})
export class DragAndDropModule {
}
