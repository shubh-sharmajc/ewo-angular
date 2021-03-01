import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageExists} from './image-exists.pipe';


@NgModule({
  declarations: [ImageExists],
  imports: [
    CommonModule
  ],
  exports: [ImageExists]
})
export class ImageExistsPipeModule {
}
