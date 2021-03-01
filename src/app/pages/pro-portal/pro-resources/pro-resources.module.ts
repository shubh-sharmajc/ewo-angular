import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {FormsModule} from '@angular/forms';

import {AuthGuard} from '../../../_guards';
import {ProResourcesComponent} from './pro-resources.component';
import {ConfigurationService} from '../../../_services/configuration/configuration.service';

const routes = [{path: '', component: ProResourcesComponent, canActivate: [AuthGuard], data: {roles: ['pro-basic', 'pro-premium']}}];

@NgModule({
  declarations: [ProResourcesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxHmCarouselModule,
    FormsModule
  ],
  exports: [ProResourcesComponent],
  providers: [ConfigurationService]
})
export class ProResourcesModule {
}
