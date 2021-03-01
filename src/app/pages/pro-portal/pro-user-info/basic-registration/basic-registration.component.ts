import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, Observer, of, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators/index';
import {NgxSpinnerService} from 'ngx-spinner';
import * as _ from 'lodash';
import * as op from 'object-path';

import {MustMatch} from '../../../../_helpers/must-match.validator';
import {EmailVerificationService} from '../../../../modal/pro-modal/email-verification/email-verification.service';
import {AuthService} from '../../../../_services/auth/auth.service';
import {AlertDialogService} from '../../../../modal/alert/alert-dialog.service';
import {UserService} from '../../../../_services/user/user.service';

import {BusinessService} from '../../../../_services/business/business.service';
import {ProUserService} from '../../../../_services/pro-user/pro-user.service';
import {VerifyEmailService} from '../../../../_services/verify-email/verify-email.service';
import {environment} from '../../../../../environments/environment';
import {SpaceValidator} from '../../../../constant';
import {countries} from '../../../../constant/country';

@Component({
  selector: 'app-basic-registration',
  templateUrl: './basic-registration.component.html',
  styleUrls: ['./basic-registration.component.scss']
})
export class BasicRegistrationComponent implements OnInit, OnDestroy {

  @Output() next = new EventEmitter<any>();
  @Output() pause = new EventEmitter<any>();
  @Input() newUser: any;
  @Input() editUser: any;
  @Input() addLocation: any;
  @ViewChild('businessName') businessName: ElementRef;
  public tokenDetails: any;
  public lcForm: FormGroup;
  public lcSubmitted: any = false;
  public brSubmitted: any = false;
  public brForm: FormGroup;
  public emailResponse: any;
  public destroy$: any = new Subject<any>();
  public proUser: any;
  public business: any;
  public isEmailResend = false;
  public website: any;
  public statesArr: any = [];
  public businessNames: Observable<any>;
  public businessCategory: Observable<any>;
  public businessTypes: any[] = [];
  public WP_LINK = `${environment.WP_LINK}`;
  public locationId: any;
  public selectedLoc: any;

  constructor(private formBuilder: FormBuilder,
              private store: Store<any>,
              private spinner: NgxSpinnerService,
              public router: Router,
              public auth: AuthService,
              private proUserService: ProUserService,
              private activatedRoute: ActivatedRoute,
              private emailVerificationDialogService: EmailVerificationService,
              private _auth: AuthService,
              private userService: UserService,
              private businessService: BusinessService,
              private alertDialog: AlertDialogService,
              private verifyEmailService: VerifyEmailService) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe(async (params: any) => {
        this.tokenDetails = {token: params.verifyToken, email: params.email};
        this.locationId = op.get(params, 'locId');
        if (this.brForm) {
          this.updateLocationData();
        }
      });
    this.filterState('United States');
  }

  ngOnInit() {
    this.createLoginCredentialsForm();
    this.createBusinessRegistrationForm();
    this.searchBusinessName();
    this.searchBusinessCategory();
    this.getProUser();
    this.verifyEmail();
    this.getBusinessType();
  }

  pauseEvent() {
    const payload: any = this.getPayload();
    if (payload) {
      payload.paused_step = 1;
      this.pause.emit(payload);
    }
  }

  nextEvent() {
    const payload: any = this.onBRSubmit();
    if (payload) {
      payload.paused_step = 2;
      this.next.emit(payload);
    }
  }

  async checkBusinessName() {
    try {
      await this.proUserService.checkBusinessName({id: this.proUser._id, name: this.brF.name.value.name});
    } catch (e) {
      if (op.get(e, 'error.message') === 'Error: Name already exist') {
        let msg: any = '';
        msg += 'This business has already been claimed. ';
        msg += 'Please contact our Support team if this business name belongs to you.';
        await this.alertDialog.alert(msg);
        this.brForm.patchValue({name: {_id: '', name: ''}});
        this.businessName.nativeElement.focus();
      } else {
        console.log('BasicRegistrationComponent -> checkBusinessName ::: ', e);
      }
    }
  }

  saveBR() {
    const payload: any = this.onBRSubmit();
    if (payload) {
      if (!this.addLocation) {
        this.brForm.markAsPristine();
        this.brForm.patchValue({btnName: 'Saving'});
        this.next.emit(payload);
      } else if (this.addLocation) {
        const newLoc: any = {};
        newLoc.address = payload.address;
        newLoc.address2 = payload.address2;
        newLoc.country = payload.country;
        newLoc.state = payload.state;
        newLoc.city = payload.city;
        newLoc.zip = payload.zip;
        newLoc.phone = payload.phone;
        this.addNewBusinessLocation(newLoc);
      }
    }
  }

  async addNewBusinessLocation(payload: any) {
    try {
      const res: any = await this.businessService.addNewBusinessLocation(this.business._id, payload);
      if (op.get(res, 'status') === 'success') {
        const locId: any = op.get(res, 'data.location._id');
        this.router.navigate([`/pro/account/basic-registration/${locId}`]);
      }
    } catch (e) {
      console.log('BasicRegistrationComponent -> addNewBusinessLocation ::: ', e);
    }
  }

  searchBusinessName() {
    this.businessNames = new Observable((observer: Observer<string>) => {
      observer.next(this.bName.get('name').value);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.businessService.searchBusinessName(query);
        }
        return of([]);
      })
    );
  }

  updateBusinessName() {
    this.brForm.patchValue({name: {_id: null, name: this.bName.get('name').value}});
  }

  onBusinessNameSelect(event: any): void {
    if (event && event.item) {
      this.brForm.patchValue({name: event.item});
    }
  }

  searchBusinessCategory() {
    this.businessCategory = new Observable((observer: Observer<string>) => {
      observer.next(this.bCatName.get('name').value);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.businessService.searchBusinessCategory(query);
        }
        return of([]);
      })
    );
  }

  updateBusinessCatName() {
    this.brForm.patchValue({category: {_id: null, name: this.bCatName.get('name').value}});
  }

  onBusinessCategorySelect(event: any): void {
    if (event && event.item) {
      this.brForm.patchValue({category: event.item});
    }
  }

  async getBusinessType() {
    await this.businessService.getBusinessTypes();
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.bussTypes) {
          this.businessTypes = _.sortBy(res.bussTypes, function (item) {
            return item.name === 'Service provider' ? 0 : 1;
          });
          this.movebusinessTypes(this.businessTypes, 3, 2);
          this.updateBusinessTypesFA();
        }
      });
  }

  movebusinessTypes(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  createLoginCredentialsForm() {
    const email = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
    const passPattern: any = /^(?=\D*\d)(?=.*[!@#$.,'"?\/%^&*])(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}$/;
    this.lcForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(email)]],
      password: ['', [Validators.required, Validators.pattern(passPattern)]],
      confirm_password: ['', Validators.required],
      captcha: [null, Validators.required]
    }, {
      validator: MustMatch('password', 'confirm_password')
    });
  }

  createBusinessRegistrationForm() {
    const zip = /^(?:\d{5},\s?)*\d{5}$/;
    const websitePattern = '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$';
    this.brForm = this.formBuilder.group({
      name: new FormGroup({
        _id: new FormControl(['']),
        name: new FormControl(['', [Validators.required, Validators.maxLength(40), SpaceValidator.cannotContainSpace]])
      }),
      category: new FormGroup({_id: new FormControl(['']), name: new FormControl([''])}),
      types: this.formBuilder.array([]),
      address: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      address2: ['', []],
      email_verify: [false, []],
      doNotDisplay: ['', []],
      city: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      state: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      country: ['United States', []],
      zip: ['', [Validators.required, SpaceValidator.cannotContainSpace, Validators.pattern(zip)]],
      phone: ['', [Validators.required]],
      website: ['', [Validators.pattern(websitePattern)]],
      btnName: ['Save', []]
    });
  }

  updateLoginCredentialsForm() {
    const email: any = this.proUser && this.proUser.email ? this.proUser.email : '';
    this.lcForm.patchValue({email});
  }

  updateBusinessRegistrationForm() {
    const email_verify: any = op.get(this.proUser, 'email_verify', false);
    const name: any = op.get(this.business, 'name', {_id: null, name: ''});
    const category: any = op.get(this.business, 'category', {_id: null, name: ''});
    const location: any = !this.addLocation && op.get(this.selectedLoc, 'location');
    const address: any = op.get(location, 'address', '');
    const address2: any = op.get(location, 'address2', '');
    const country: any = op.get(location, 'country', 'United States');
    const state: any = op.get(location, 'state', '');
    const city: any = op.get(location, 'city', '');
    const doNotDisplay: any = op.get(location, 'hide_address', false);
    const phone: any = op.get(location, 'phone.num', '');
    const zip: any = op.get(location, 'zip', '');
    const website: any = op.get(this.business, 'link', '');
    this.brForm.patchValue({
      email_verify, country, state, city, name, category,
      address, address2, phone, zip, website, doNotDisplay
    });
    if (country) {
      this.filterState(country);
    }

    if (website) {
      this.linkPreview();
    }
    this.brForm.markAsPristine();
  }

  updateLocationData() {
    const bLocation: any = op.get(this.business, 'locations', []);
    this.selectedLoc = bLocation.find((o: any) => {
      return this.locationId ? this.locationId === op.get(o, 'location._id') : o.is_default;
    });
    this.updateBusinessRegistrationForm();
  }

  setLinkPrefix() {
    const website: any = this.brForm.get('website').value;
    if (!website) {
      this.brForm.patchValue({website: 'https://www.'});
    }
  }

  filterState(name) {
    this.statesArr = [];
    if (name) {
      const obj: any = countries.find((o: any) => o.name === name);
      if (obj) {
        this.statesArr = obj.states;
      }
    }
  }

  get lcF() {
    return this.lcForm.controls;
  }

  get brF() {
    return this.brForm.controls;
  }

  get bTypes(): FormArray {
    return this.brForm.get('types') as FormArray;
  }

  get bName(): any {
    return this.brForm.get('name') as any;
  }

  get bCatName(): any {
    return this.brForm.get('category') as any;
  }

  updateBusinessTypesFA() {
    // Clear checkbox array
    for (let i = this.bTypes.length - 1; i >= 0; i--) {
      this.bTypes.removeAt(i);
    }
    this.businessTypes.forEach((bt) => {
      this.bTypes.push(new FormControl(op.get(this.business, 'types', []).indexOf(bt._id) > -1));
    });
  }

  getBusinessTypeIDs() {
    return this.brForm.value.types.map((v, i) => v ? this.businessTypes[i]._id : null).filter(v => v !== null);
  }

  async checkUserEmailExist(email: string) {
    const resp: any = await this.userService.checkUserEmailExist(email);
    if (resp && resp.data && resp.data.email === email) {
      this.lcForm.patchValue({email: '', password: '', confirm_password: ''});
      this.emailVerificationDialogService.openEmailVerificationModal(resp.data);
    }
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          if (this.brForm.get('btnName').value === 'Saving') {
            this.brForm.patchValue({btnName: 'Saved'});
          }
          this.proUser = res.proUser;
          this.business = op.get(res.proUser, 'business');
          this.updateLoginCredentialsForm();
          this.updateLocationData();
        }
      });
  }

  resetBtnName() {
    this.brForm.patchValue({btnName: 'Save'});
  }

  async resendEmail() {
    this.isEmailResend = false;
    const data: any = this.lcForm.getRawValue();
    const res: any = await this.verifyEmailService.sendEmailVerification(data.email);
    this.isEmailResend = res && res.status === 'success';
  }

  async onLCSubmit() {

    if (!this.lcSubmitted) {
      Object.keys(this.lcForm.controls).forEach(control => {
        this.lcForm.controls[control].markAsDirty();
      });
      this.lcSubmitted = true;
    }
    // stop here if form is invalid
    if (this.lcForm.invalid) {
      return;
    }

    const res: any = await this._auth.signUpPro(this.lcForm.getRawValue());
    this.emailResponse = res.status;
    if (res && res.status && res.message) {
      this.alertDialog.alert(res.message);
    }
    if (res && res.status && res.messages && res.messages.length) {
      this.alertDialog.alert(res.messages[0]['message']);
    }
    if (res.status === 'success' && res.user) {
      // Todo: enable check mark
    }
  }

  async verifyEmail() {
    try {
      if (this.tokenDetails.token && this.tokenDetails.email) {
        this.spinner.show();
        await this._auth.verifyEmailToken(this.tokenDetails.token, this.tokenDetails.email);
        this.spinner.hide();
        window.location.href = `${environment.SITE_URL}/pro/resume-registration`;
      }

    } catch (e) {
      console.error('ProVerifyEmailComponent -> verifyEmail ::: ', e);
      this.spinner.hide();
      await this.router.navigate(['/']);
    }
  }

  getPayload() {
    const formData: any = this.brForm.getRawValue();
    const payload: any = {basic_form: true};
    payload.name = formData.name && formData.name._id ? formData.name._id : formData.name.name;
    payload.category = formData.category && formData.category._id ? formData.category._id : formData.category.name;
    payload.types = this.getBusinessTypeIDs();
    payload.address = formData.address;
    payload.address2 = formData.address2;
    payload.city = formData.city;
    payload.state = formData.state;
    payload.country = formData.country ? formData.country : 'United States';
    payload.zip = formData.zip;
    payload.hide_address = formData.doNotDisplay;
    payload.phone = {cnt_code: '+1', num: formData.phone};
    payload.link = formData.website;
    return payload;
  }

  onBRSubmit() {
    if (!this.brSubmitted) {
      this.brSubmitted = true;
    }

    // stop here if form is invalid
    if (this.brForm.invalid) {
      return;
    }
    return this.getPayload();
  }

  async linkPreview() {
    try {
      const website: any = this.brForm.get('website').value;
      if (website) {
        const link: any = await this.proUserService.linkPreview({link: website});
        if (link && link.data) {
          this.website = link.data;
        }
      }
    } catch (e) {
      this.website = null;
    }
  }

  async autoSave() {
    if (this.newUser) {
      const payload: any = this.getPayload();
      if (payload) {
        const location: any = op.get(this.selectedLoc, 'location');
        const locID: any = op.get(location, '_id');
        await this.proUserService.updateProUser(this.proUser._id, locID, payload);
        if (!locID) {
          await this.auth.getProUser();
        }
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
