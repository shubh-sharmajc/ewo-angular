import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProMarketingSolutionsComponent } from './pro-marketing-solutions.component';
import { RouterModule } from '@angular/router';
import { ProListingModule } from '../../modules/pro-listing/pro-listing.module';

const routes = [
  {path: '', component: ProMarketingSolutionsComponent}
];

@NgModule({
  declarations: [ProMarketingSolutionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProListingModule
  ]
})
export class ProMarketingSolutionsModule { }
 