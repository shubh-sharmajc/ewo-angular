import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProCategoriesComponent } from './pro-categories.component';
import { RouterModule } from '@angular/router';
import { ProListingModule } from '../../modules/pro-listing/pro-listing.module';

const routes = [
  {path: '', component: ProCategoriesComponent}
];

@NgModule({
  declarations: [ProCategoriesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProListingModule
  ]
})
export class ProCategoriesModule { }
