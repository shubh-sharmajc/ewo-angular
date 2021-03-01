import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService as SocialAuth, FacebookLoginProvider} from 'angularx-social-login';
import * as op from 'object-path';

import {AuthService} from '../../_services/auth/auth.service';
import {environment} from '../../../environments/environment';
import {GoogleOAuthService} from '../../_services/google-oauth/google-oauth.service';
import {AlertDialogService} from '../../modal/alert/alert-dialog.service';
import {PRO_USER_ROLES} from '../../constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loading = false;
  public currentUser: any;
  public submitted = false;
  public showErrorMessage = false;
  public returnUrl: any;
  public WP_LINK: any = environment.WP_LINK;

  constructor(private formBuilder: FormBuilder,
              public router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              private spinner: NgxSpinnerService,
              private sAuth: SocialAuth,
              private authService: AuthService,
              public googleOAuth: GoogleOAuthService,
              private alertDialog: AlertDialogService) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember_me: [false]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  public async onSubmit() {
    if (!this.submitted) {
      this.submitted = true;
    }
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    await this.login(this.loginForm.getRawValue());
  }

  public async loginWithGoogle() {
    try {
      await this.login(await this.googleOAuth.signIn());
    } catch (e) {
      console.error('LoginComponent -> loginWithGoogle ::: ', e);
    }
  }

  public async loginWithFacebook() {
    try {
      const res: any = await this.sAuth.signIn(FacebookLoginProvider.PROVIDER_ID);
      const obj: any = {};
      obj.id = res && res.id ? res.id : '';
      obj.social_type = 'facebook';
      obj.email = res && res.email ? res.email : '';
      obj.access_token = res && res.authToken ? res.authToken : '';
      await this.login(obj);
    } catch (e) {
      console.error('LoginComponent -> loginWithGoogle ::: ', e);
    }
  }

  private async login(payload) {
    try {
      this.loading = true;
      this.spinner.show();
      if (payload.social_type === 'google' || payload.social_type === 'facebook') {
        this.currentUser = await this.authService.socialLogin(payload);
      } else {
        this.currentUser = await this.authService.login(payload);
      }
      this.submitted = false;
      this.loading = false;
      this.spinner.hide();
      if (typeof this.returnUrl !== 'undefined' && this.returnUrl.split('/')[0] === 'wp') {
        window.location.href = `${this.WP_LINK}${this.returnUrl.replace('wp/', '')}`;
      } else if (typeof this.returnUrl !== 'undefined' && this.returnUrl.split('/')[0] === 'nb') {
        window.location.href = `${environment.DISSCUSSION_LINK}${this.returnUrl.replace('nb/', '')}`;
      } else {
        if (this.returnUrl) {
          window.location.href = `${environment.SITE_URL}${this.returnUrl}`;
        } else {
          const currentUser: any = op.get(this.currentUser, 'user');
          const role: any = op.get(currentUser, 'role');
          if (PRO_USER_ROLES.indexOf(role) > -1) {
            const business: any = op.get(currentUser, 'business');
            const is_complete = op.get(business, 'is_complete');
            this.router.navigate([`${is_complete ? '/pro/account' : '/growth/solutions'}`]);
          } else {
            this.router.navigate(['']);
          }
        }
      }
    } catch (e) {
      this.submitted = false;
      this.loading = false;
      this.spinner.hide();
      if (!payload.social_type) {
        this.showErrorMessage = true;
        this.loginForm.reset();
      } else if (payload.social_type === 'google') {
        if (e && e.error && e.error.message === 'Invalid user details') {
          this.alertDialog.alert('Couldn\'t find your EWO account. Please "Create a new account".');
        }
      }
    }
  }
}
