import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgSelectModule} from '@ng-select/ng-select';
import {DragScrollModule} from 'ngx-drag-scroll';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ConfigurationService} from '../../../_services/configuration/configuration.service';
import {FindProsComponent} from './find-pros.component';
import { ProviderFilterComponent } from './provider-filter/provider-filter.component';

const routes = [
  {path: '', component: FindProsComponent},
  {path: 'details', loadChildren: './find-pros-details/find-pros-details.module#FindProsDetailsModule'},
  {path: 'provider-filter', component: ProviderFilterComponent}
];

@NgModule({
  declarations: [FindProsComponent, ProviderFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule.forRoot(),
    RouterModule.forChild(routes),
    TabsModule.forRoot(),
    TypeaheadModule.forRoot(),
    NgSelectModule,
    DragScrollModule
  ],
  exports: [FindProsComponent],
  providers: [ConfigurationService]
})
export class FindProsModule {
}
