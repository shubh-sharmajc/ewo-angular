import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CheckLoginClickDirective} from './check-login-click.directive';

@NgModule({
  declarations: [CheckLoginClickDirective],
  imports: [
    CommonModule
  ],
  exports: [CheckLoginClickDirective]
})
export class CheckLoginModule {
}
