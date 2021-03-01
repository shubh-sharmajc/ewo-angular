import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import * as op from 'object-path';

import {DATE_FORMAT, DATE_FORMAT2, DateValidator, SpaceValidator} from '../../../../constant';
import {countries} from '../../../../constant/country';
import {AuthService} from '../../../../_services/auth/auth.service';
import {ProUserService} from '../../../../_services/pro-user/pro-user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent implements OnInit, OnDestroy {

  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  @Output() pause = new EventEmitter<any>();
  @Input() newUser: any;
  @Input() editUser: any;
  public proUser: any;
  public bpSubmitted: any;
  public location: any;
  public state: any;
  public businessProfileForm: FormGroup;
  public destroy$: any = new Subject<any>();
  private business: any;
  public statesArr: any[];
  public locationId: any;
  public selectedLoc: any;

  constructor(private store: Store<any>,
              private activatedRoute: ActivatedRoute,
              public auth: AuthService,
              private proUserService: ProUserService,
              private formBuilder: FormBuilder) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.locationId = op.get(params, 'locId');
        if (this.businessProfileForm) {
          this.updateLocationData();
        }
      });
  }

  ngOnInit() {
    this.createBusinessProfile();
    this.getProUser();
  }

  toggleDateView(isDateEdit: any) {
    this.businessProfileForm.patchValue({isDateEdit: !isDateEdit});
    setTimeout(() => {
      const inputEle: any = document.getElementById(`launch`);
      if (inputEle) {
        inputEle.focus();
      }
    }, 100);
  }

  getConvertedDate(d: string) {
    return d ? moment(d, DATE_FORMAT).format(DATE_FORMAT2) : DATE_FORMAT;
  }

  createBusinessProfile() {
    const numPattern = '^[0-9]*$';
    const zip = /^(?:\d{5},\s?)*\d{5}$/;
    this.businessProfileForm = this.formBuilder.group({
      email: ['', []],
      name: ['', []],
      tagline: ['', [Validators.maxLength(80)]],
      launch: ['', [Validators.required, DateValidator.dateValidator]],
      license: ['', [Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(800), SpaceValidator.cannotContainSpace]],
      history: ['', [Validators.maxLength(1000)]],
      diff_services: ['', [Validators.required, Validators.maxLength(595), SpaceValidator.cannotContainSpace]],
      services: ['', [Validators.required, Validators.maxLength(1000), SpaceValidator.cannotContainSpace]],
      solutions: ['', [Validators.maxLength(500)]],
      hours: ['', [Validators.maxLength(500)]],
      from: ['', [Validators.pattern(numPattern)]],
      to: ['', [Validators.pattern(numPattern)]],
      zips: ['', [Validators.required, SpaceValidator.cannotContainSpace, Validators.pattern(zip)]],
      isDateEdit: [false],
      btnName: ['Save', []]
    });
  }

  updateForm() {
    const email: any = op.get(this.proUser, 'email', '');
    const name: any = op.get(this.business, 'name.name', '');
    const tagline: any = op.get(this.business, 'tagline', '');
    let launch: any = op.get(this.business, 'launch', '');
    if (launch) {
      launch = moment(launch).format(DATE_FORMAT);
    }
    const license: any = op.get(this.location, 'license', '');
    const description: any = op.get(this.location, 'description', '');
    const history: any = op.get(this.location, 'history', '');
    const diff_services: any = op.get(this.location, 'diff_services', '');
    const services: any = op.get(this.location, 'services', '');
    const solutions: any = op.get(this.location, 'solutions', '');
    const hours: any = op.get(this.location, 'hours', '');
    const zips: any = op.get(this.location, 'zips', '').toString();
    const from: any = op.get(this.location, 'price_range.from', '');
    const to: any = op.get(this.location, 'price_range.to', '');
    this.businessProfileForm.patchValue({
      email, name, tagline, launch, license, description, history, diff_services,
      services, solutions, hours, zips, from, to
    });
    this.businessProfileForm.markAsPristine();
  }

  updateLocationData() {
    const bLocation: any = op.get(this.business, 'locations', []);
    this.selectedLoc = bLocation.find((o: any) => {
      return this.locationId ? this.locationId === op.get(o, 'location._id') : o.is_default;
    });
    this.location = op.get(this.selectedLoc, 'location');
    this.updateForm();
  }

  get f() {
    return this.businessProfileForm.controls;
  }

  resetBtnName() {
    this.businessProfileForm.patchValue({btnName: 'Save'});
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          if (this.businessProfileForm.get('btnName').value === 'Saving') {
            this.businessProfileForm.patchValue({btnName: 'Saved'});
          }
          this.proUser = res.proUser;
          this.business = op.get(res.proUser, 'business');
          this.filterState('United States');
          this.updateLocationData();
        }
      });
  }

  filterState(name) {
    this.statesArr = [];
    if (name) {
      const obj: any = countries.find((o: any) => o.name === name);
      if (obj) {
        this.statesArr = obj.states;
      }
      this.state = this.statesArr.find((o: any) => o.name === op.get(this.location, 'state'));
    }
  }

  previousEvent() {
    const payload: any = this.getPayload();
    if (payload) {
      payload.paused_step = 1;
      this.previous.emit(payload);
    }
  }

  pauseEvent() {
    const payload: any = this.getPayload();
    if (payload) {
      payload.paused_step = 2;
      this.pause.emit(payload);
    }
  }

  nextEvent() {
    const payload: any = this.onBPSubmit();
    if (payload) {
      payload.paused_step = 3;
      this.next.emit(payload);
    }
  }

  saveBP() {
    const payload: any = this.onBPSubmit();
    if (payload) {
      this.businessProfileForm.markAsPristine();
      this.businessProfileForm.patchValue({btnName: 'Saving'});
      this.next.emit(payload);
    }
  }

  async autoSave() {
    if (this.newUser) {
      const payload: any = this.getPayload();
      if (payload) {
        const location: any = op.get(this.selectedLoc, 'location');
        const locID: any = op.get(location, '_id');
        await this.proUserService.updateProUser(this.proUser._id, locID, payload);
      }
    }
  }

  formatString(field, str) {
    let strArray = str.split('\n');
    strArray = strArray.filter((item) => {
      return item !== '';
    });
    const format = strArray.join('\n').split(',, ').join(',');
    switch (field) {
      case 'services':
        this.businessProfileForm.patchValue({services: format});
        break;
      case 'solutions':
        this.businessProfileForm.patchValue({solutions: format});
        break;
      case 'hours':
        this.businessProfileForm.patchValue({hours: format});
        break;
      default:
      // code block
    }

  }

  getPayload() {
    const formData: any = this.businessProfileForm.getRawValue();
    formData.price_range = {from: formData.from, to: formData.to};
    formData.profile_form = true;
    formData.launch = moment(formData.launch, DATE_FORMAT).valueOf();
    return formData;
  }

  onBPSubmit() {
    if (!this.bpSubmitted) {
      this.bpSubmitted = true;
    }

    // stop here if form is invalid
    if (this.businessProfileForm.invalid) {
      return;
    }
    return this.getPayload();
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
