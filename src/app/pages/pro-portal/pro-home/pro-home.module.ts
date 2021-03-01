import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProHomeComponent} from './pro-home.component';

const routes = [{path: '', component: ProHomeComponent}];

@NgModule({
  declarations: [ProHomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ProHomeComponent]
})
export class ProHomeModule {
}
