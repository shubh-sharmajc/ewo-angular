import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';

import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../_services/user/user.service';
import {countries} from '../../../../constant/country';
import {MustMatch, MustNotMatch} from '../../../../_helpers/must-match.validator';
import {MainService} from '../../../../_services/main.service';
import {BroadcasterService} from '../../../../_services/broadcaster/broadcaster.service';
import {AlertDialogService} from '../../../../modal/alert/alert-dialog.service';
import {SpaceValidator} from '../../../../constant';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  public DISSCUSSION_LINK: any = environment.DISSCUSSION_LINK;
  public profileInfoForm: FormGroup;
  public changePasswordForm: FormGroup;
  public submitted: any = false;
  public changePasswordSubmitted: any = false;
  public ages: any = [{value: '18-24'}, {value: '25-34'}, {value: '35-44'}, {value: '45-54'}, {value: '55-64'}, {value: '65-74'}];
  public currentUser: any;
  public statesArr: any = [];
  public showMyInfoView: any = true;
  public profileUrl: any;
  public url: any = {};
  public destroy$: any = new Subject<any>();

  constructor(private store: Store<any>,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private _mainService: MainService,
              public broadcaster: BroadcasterService,
              private alertDialogService: AlertDialogService,
              private router: Router) {
    this.createForm();
    this.createChangePasswordForm();
    this.filterState('United States');
  }

  ngOnInit() {
    this.getLoginUser();
    this.broadcaster.isShowMyInfo.subscribe(value => {
      this.showMyInfoView = value;
    });
  }

  getLoginUser() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
        if (this.currentUser) {
          this.profileUrl = `${environment.DISSCUSSION_LINK}user/${res.data.username}`;
          this.updateForm();
        }
      });
  }

  createForm() {
    this.profileInfoForm = this.formBuilder.group({
      username: [{value: '', disabled: true}, Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      first_name: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      last_name: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      gender: ['', [Validators.required]],
      age: ['', [Validators.required]],
      occupation: [''],
      city: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      country_code: [''],
      country: ['United States', [Validators.required]],
      state: ['', [Validators.required]],
      about_me: ['', [Validators.required, SpaceValidator.cannotContainSpace]],
      hobbies: ['']
    });
  }

  createChangePasswordForm() {
    const strPattern: any = /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}$/;
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(strPattern)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: [
        MustNotMatch('oldPassword', 'newPassword'),
        MustMatch('newPassword', 'confirmPassword')
      ]
    });
  }

  updateForm() {
    const username: any = this.currentUser && this.currentUser.username ? this.currentUser.username : '';
    const email: any = this.currentUser && this.currentUser.email ? this.currentUser.email : '';
    const first_name: any = this.currentUser && this.currentUser.first_name ? this.currentUser.first_name : '';
    const last_name: any = this.currentUser && this.currentUser.last_name ? this.currentUser.last_name : '';
    const gender: any = this.currentUser && this.currentUser.gender ? this.currentUser.gender.toString() : '';
    const age: any = this.currentUser && this.currentUser.age ? this.currentUser.age : '';
    const occupation: any = this.currentUser && this.currentUser.occupation ? this.currentUser.occupation : '';
    const city: any = this.currentUser && this.currentUser.city ? this.currentUser.city : '';
    const country_code: any = this.currentUser && this.currentUser.country_code ? this.currentUser.country_code : '';
    const country: any = this.currentUser && this.currentUser.country ? this.currentUser.country : '';
    const state: any = this.currentUser && this.currentUser.state ? this.currentUser.state : '';
    const about_me: any = this.currentUser && this.currentUser.about_me ? this.currentUser.about_me : '';
    const hobbies: any = this.currentUser && this.currentUser.hobbies ? this.currentUser.hobbies : '';
    this.profileInfoForm.patchValue({
      username, first_name, last_name, email, gender, age, occupation,
      city, country_code, country, state, about_me, hobbies
    });
    this.filterState(country);
  }

  filterState(name: string) {
    this.statesArr = [];
    if (name) {
      const obj: any = countries.find((o: any) => o.name === name);
      if (obj) {
        this.statesArr = obj.states;
      }
    }
  }

  get f() {
    return this.profileInfoForm.controls;
  }

  get f1() {
    return this.changePasswordForm.controls;
  }

  async onChangePasswordSubmit() {
    if (!this.changePasswordSubmitted) {
      this.changePasswordSubmitted = true;
    }
    if (this.changePasswordForm.invalid) {
      return;
    }
    const data: any = this.changePasswordForm.getRawValue();
    data.email = this.currentUser.email;
    if (data.about_me) {
      data.about_me = data.about_me.trim();
    }
    const res: any = await this.userService.updatePassword(data);
    if (res && res.status && res.message) {
      this.alertDialogService.alert(res.message);
    }
    if (res && res.status && res.messages && res.messages.length) {
      this.alertDialogService.alert(res.messages[0]['message']);
    }
    this.changePasswordSubmitted = false;
    this.changePasswordForm.reset();
  }

  async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }
    if (this.profileInfoForm.invalid) {
      return;
    }
    const data: any = this.profileInfoForm.getRawValue();
    await this.userService.updateUserProfile(this.currentUser._id, data);
    this.router.navigate(['/user/' + this.currentUser.username]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
