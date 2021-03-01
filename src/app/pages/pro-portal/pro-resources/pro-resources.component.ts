import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {ConfigurationService} from '../../../_services/configuration/configuration.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-pro-resources',
  templateUrl: './pro-resources.component.html',
  styleUrls: ['./pro-resources.component.scss']
})
export class ProResourcesComponent implements OnInit {
  public index = 0;
  public dataArr: any = [];
  public WP_STORIES_LINK = `${environment.WP_STORIES_LINK}`;

  constructor(public sanitizer: DomSanitizer,
              private configService: ConfigurationService) {
  }

  ngOnInit() {
    this.getProResourcePageArticle();
  }

  async getProResourcePageArticle() {
    this.dataArr = await this.configService.getProResourcePageArticle();
  }


}
