import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, Observer, of, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators/index';
import * as op from 'object-path';
import * as _ from 'lodash';

import {ProUserService} from '../../../_services/pro-user/pro-user.service';
import {ConfigurationService} from '../../../_services/configuration/configuration.service';
import {AppState} from '../../../app.state';


@Component({
  selector: 'app-find-pros',
  templateUrl: './find-pros.component.html',
  styleUrls: ['./find-pros.component.scss']
})
export class FindProsComponent implements OnInit, OnDestroy {

  @ViewChildren('dragScroll') dragScroll: QueryList<any>;
  public destroy$: any = new Subject<any>();
  public industries = [
    {id: 1, name: 'Personal Wellness'},
    {id: 2, name: 'Home and Living'},
    {id: 3, name: 'Work & Travel'},
    {id: 4, name: 'Working remotely'},
    {id: 5, name: 'Travel'},
    {id: 6, name: 'Looking Beyond'},
];
  public proAllData: any[] = [];
  public proDetail: any = [];
  public searchForm: FormGroup;
  public oPath: any = op;
  public viewing: any = 'categories';

  constructor(public router: Router,
              private formBuilder: FormBuilder,
              private store: Store<AppState>,
              private configurationService: ConfigurationService,
              private proUserService: ProUserService) {
  }

  ngOnInit() {
    this.createSearchForm();
    this.searchPro();
    this.getProAllData();
  }

  createSearchForm() {
    this.searchForm = this.formBuilder.group({
      searchString: new FormControl(''),
      search: new FormGroup({
        _id: new FormControl(''),
        zipcode: new FormControl(''),
        category: new FormGroup({
          _id: new FormControl(''),
          name: new FormControl('')
        }),
        location: new FormGroup({
          _id: new FormControl(''),
          name: new FormControl('')
        }),
        name: new FormGroup({
          _id: new FormControl(''),
          name: new FormControl('')
        })
      })
    });
  }

  updateSearchForm() {
    this.searchForm.patchValue({
      search: {
        _id: '',
        category: {_id: '', name: ''},
        location: {_id: '', name: ''},
        name: {_id: ''}
      }
    });
  }

  onSelectProResult(event: any): void {
    const item: any = op.get(event, 'item');
    if (item) {
      this.searchForm.patchValue({search: event.item});
    }
  }

  random() {
    return Math.random().toString(36).substring(2, 15);
  }


  moveRight(intIndex: any) {
    const data: any[] = this.dragScroll.toArray();
    data[intIndex].moveRight();
  }

  moveLeft(intIndex) {
    const data: any[] = this.dragScroll.toArray();
    data[intIndex].moveLeft();
  }

  async getProAllData() {
    this.store.select('config')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.proAllData = op.get(res, 'getProAllData', []);
      });
    await this.configurationService.getProAllData();
  }

  searchPro() {
    this.proDetail = new Observable((observer: Observer<string>) => {
      observer.next(this.searchForm.get('search').get('name').get('name').value);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          this.searchForm.patchValue({searchString: query});
          // using github public api to get users by name
          return this.proUserService.searchProviders({searchString: query});
        }
        return of([]);
      })
    );
  }

  reachesRightBound(e: any, data: any) {
    data.isReachesRightBound = e;
  }

  reachesLeftBound(e: any, data: any) {
    data.isReachesLeftBound = e;
  }

  goToFindProDetails() {
    const formData: any = this.searchForm.getRawValue();
    const qp: any = {};
    qp.zipcode = op.get(formData, 'search.zipcode');
    qp.category = op.get(formData, 'search.category._id');
    qp.searchString = op.get(formData, 'searchString');
    const queryParams: any = _.pickBy(qp, _.identity);
    if (!_.isEmpty(queryParams)) {
      this.router.navigate(['/find-pros/details'], {queryParams});
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
