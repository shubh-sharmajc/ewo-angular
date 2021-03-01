import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgSelectModule} from '@ng-select/ng-select';
import {DragScrollModule} from 'ngx-drag-scroll';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {FormsModule} from '@angular/forms';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {NgxMaskModule} from 'ngx-mask';
import {ScrollEventModule} from 'ngx-scroll-event';

import {FindProsDetailsComponent} from './find-pros-details.component';
import {ProUserService} from '../../../../_services/pro-user/pro-user.service';
import {ContactUsModule} from '../../../../modal/pro-modal/contact-us/contact-us.module';
import {RatingModule} from '../../../../modules/rating/rating.module';

const routes = [{path: '', component: FindProsDetailsComponent}];

@NgModule({
  declarations: [FindProsDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TabsModule.forRoot(),
    NgSelectModule,
    DragScrollModule,
    RatingModule,
    NgxHmCarouselModule,
    FormsModule,
    ScrollEventModule,
    TypeaheadModule.forRoot(),
    ContactUsModule,
    NgxMaskModule.forRoot()
  ],
  exports: [FindProsDetailsComponent],
  providers: [ProUserService]
})
export class FindProsDetailsModule {
}
