import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {VerifyEmailComponent} from './verify-email.component';

const routes = [
  {path: '', component: VerifyEmailComponent}
];

@NgModule({
  declarations: [VerifyEmailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [VerifyEmailComponent]
})
export class VerifyEmailModule {
}
