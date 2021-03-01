import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

import {environment} from '../../../environments/environment';
import {AppState} from '../../app.state';
import {GetExploreFeaturesAction, GetHomeContentAction, GetProAllDataAction} from '../../store/actions/configuration-actioin';

@Injectable()
export class ConfigurationService {

  constructor(private store: Store<AppState>,
              private http: HttpClient,
              private sanitizer: DomSanitizer) {
  }

  getExploreFeatures() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/configuration/explore_features`)
        .subscribe((res: any) => {
          if (res.data && res.data.tabs && res.data.tabs.length) {
            res.data.tabs = res.data.tabs.map((o: any) => {
              o.content = this.sanitizer.bypassSecurityTrustHtml(o.content);
              return o;
            });
          }
          this.store.dispatch(new GetExploreFeaturesAction(res.data));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  getHomeContent() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/configuration/home_content`)
        .subscribe((res: any) => {
          this.store.dispatch(new GetHomeContentAction(res.data));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  getProAllData() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/configuration/get-all-data`)
        .subscribe((res: any) => {
          this.store.dispatch(new GetProAllDataAction(res.data));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  getProCategories() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/configuration/industries/categories`)
        .subscribe((res: any) => {
          const data: any = res && res.length ? res.filter((o) => o.name) : [];
          return resolve(data);
        }, (e) => reject(e));
    });
  }

  getPricePlans() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/configuration/plans`)
        .subscribe((res) => resolve(res), (e) => reject(e));
    });
  }

  getMarketingPageArticle() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.WP_LINK}wp-json/wl/v1/marketing_pages`)
        .subscribe((res) => resolve(res), (e) => reject(e));
    });
  }

  getProResourcePageArticle() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.WP_LINK}wp-json/wl/v1/pro_resources`)
        .subscribe((res) => resolve(res), (e) => reject(e));
    });
  }
}
