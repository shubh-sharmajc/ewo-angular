import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProHowItWorksComponent } from './pro-how-it-works.component';
import { RouterModule } from '@angular/router';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {FormsModule} from '@angular/forms';

const routes = [
  {path: '', component: ProHowItWorksComponent}
];


@NgModule({
  declarations: [ProHowItWorksComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxHmCarouselModule,
    FormsModule
  ]
})
export class ProHowItWorksModule { }
