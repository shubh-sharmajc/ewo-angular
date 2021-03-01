import {AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {InViewportMetadata} from 'ng-in-viewport';
import {ActivatedRoute} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, FacebookLoginProvider} from 'angularx-social-login';
import {takeUntil} from 'rxjs/operators';
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import * as _ from 'lodash';
import * as op from 'object-path';
import {environment} from '../../../../environments/environment';
import {AppState} from '../../../app.state';
import {ImageGalleryService} from '../../../_services/image-gallery/image-gallery.service';
import {MainService} from '../../../_services/main.service';
import {ConfigurationService} from '../../../_services/configuration/configuration.service';
import {ShareViaEmailDialogService} from '../../../modal/share-via-email/share-via-email-dialog.service';
import {BasicAccountSetupDialogService} from '../../../modal/basic-account-setup/basic-account-setup-dialog.service';
import {SaveInMediabookDialogService} from '../../../modal/save-in-mediabook/save-in-mediabook-dialog.service';
import {UserService} from '../../../_services/user/user.service';
import {UniversalStorageService} from '../../../_services/universal-storage-service/universal-storage.service';
import {AlertDialogService} from '../../../modal/alert/alert-dialog.service';
import {GoogleOAuthService} from '../../../_services/google-oauth/google-oauth.service';
import {SignUpDialogService} from '../../../modal/sign-up-popup/sign-up-dialog.service';
import {IncompleteRegistrationDialogService} from '../../../modal/incomplete-registration/incomplete-registration-dialog.service';
import {RegisteredEmailDialogService} from '../../../modal/registered-email/registered-email-dialog.service';
import {PRO_USER_ROLES} from '../../../constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public lastPing?: Date = null;
  public imageList: any = [];
  public likeStatus: any = [];
  public disable = false;
  public imageCounter = 0;
  public promotionCounter = 0;
  public bannerCounter = 0;
  public endImage = 0;
  public scrollCounter = 0;
  public scrollEnable = true;
  public currentUser: any;
  public count_sec = 0;
  public alive = false;
  public ramdon_no = 0;
  public isLoading = false;
  public bannerId: number;
  public homeData: any = [];
  public awsbucketUrl = `${environment.bucketURL}`;
  public WP_LINK = `${environment.WP_LINK}`;
  public WP_STORIES_LINK = `${environment.WP_STORIES_LINK}`;
  public registerForm: FormGroup;
  public submitted: any = false;
  public provider: any = null;
  public newUserEmail: any = null;
  public destroy$: any = new Subject<any>();
  public image_id: any;
  public proUserRoles: any = PRO_USER_ROLES;
  public business: any;
  public isSmallScreen = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((window.innerHeight + window.scrollY + 700) >= document.body.offsetHeight) {
      // you're at the bottom of the page
      if (this.scrollEnable && this.endImage === 0) {
        this.imageData();
      }
    }
  }

  constructor(public sanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platformId, private store: Store<AppState>, public dialog: MatDialog,
              private idle: Idle, private keepalive: Keepalive, private imageGalleryService: ImageGalleryService,
              private route: ActivatedRoute, private _mainService: MainService, private formBuilder: FormBuilder,
              private cookieService: UniversalStorageService, private alertService: AlertDialogService,
              private authService: AuthService, private userService: UserService, private shareViaEmailDialogService: ShareViaEmailDialogService,
              private configurationService: ConfigurationService, public saveInMediabookDialog: SaveInMediabookDialogService,
              private basicAccountSetupDialog: BasicAccountSetupDialogService,
              private alertDialog: AlertDialogService,
              public googleOAuth: GoogleOAuthService,
              public signUpDialogService: SignUpDialogService,
              private registeredEmailDialog: RegisteredEmailDialogService,
              private incompleteRegistrationDialog: IncompleteRegistrationDialogService) {
                if(window.innerWidth<768) {
                  this.isSmallScreen= true;
                }
    this.ramdon_no = (Math.floor(Math.random() * 16) + 1);

    this.loginData();
    const bannerId = this.cookieService.getItem('bannerId');
    if (typeof bannerId != 'undefined' && parseInt(bannerId) <= 10) {
      this.bannerId = parseInt(bannerId);
    } else {
      this.bannerId = Math.floor(Math.random() * 10) + 1;
      if (parseInt(bannerId) == this.bannerId) {
        this.bannerId = Math.floor(Math.random() * 10) + 1;
      }
      this.cookieService.setItem('bannerId', JSON.stringify(this.bannerId));
    }
    this.startTimer();
  }

  startTimer() {
    this.idle.setIdle(60);
    this.idle.setTimeout(5);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout.subscribe(() => {
      this.imageCounter = 0;
      this.promotionCounter = 0;
      this.bannerCounter = 0;
      this.ramdon_no = (Math.floor(Math.random() * 16) + 1);
      this.imageList = [];
      this.imageData();
      this.resetTimer();
    });
    this.resetTimer();
    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
  }

  resetTimer() {
    this.idle.watch();
  }

  public sanitizeImage(image: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${image}')`);
  }

  registerUserFromWPAndNodebb() {
    switch (this.provider) {
      case 'facebook':
        this.signUpWithFB();
        break;
      case 'google':
        this.signUpWithGoogle();
        break;
      default:
        if (this.newUserEmail) {
          this.openBasicAccountSetupModal({email: this.newUserEmail});
        }
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmitRegister() {
    if (!this.submitted) {
      this.submitted = true;
    }

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.submitted = false;
    this.openBasicAccountSetupModal(this.registerForm.value);
  }

  signUpWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((resp: any) => {
        resp.social_type = 'facebook';
        this.openBasicAccountSetupModal(resp);
      });
  }

  signUpWithGoogle(): void {
    this.googleOAuth.signUp()
      .then((resp: any) => {
        this.openBasicAccountSetupModal(resp);
      });
  }

  async openBasicAccountSetupModal(data) {
    try {
      const resp: any = await this.userService.checkUserEmailExist(data.email);
      if (resp && resp.data && resp.data.email_verify) {
        this.registeredEmailDialog.openModal(data);
      } else if (resp && resp.data && !resp.data.email_verify) {
        this.incompleteRegistrationDialog.openModal(data);
      } else {
        this.basicAccountSetupDialog.openModal(data)
          .then(() => {
            this.registerForm.reset();
          });
      }
    } catch (e) {
      console.error('HomeComponent -> openBasicAccountSetupModal :::: ', e);
    }
  }

  ngOnInit() {
    this.createRegisterForm();
    this.getHomeContent();
    this.imageData();
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        if (params.p) {
          this.provider = params.p;
        }
        if (params.e) {
          this.newUserEmail = params.e;
        }
      });
  }

  async getHomeContent() {
    this.store.select('config')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data && data.homeContent) {
          this.homeData = data.homeContent;
         this.homeData.post_login_welcome_msg_heading = 'Welcome back,'
        }
      });
    await this.configurationService.getHomeContent();
  }

  ngAfterViewInit() {
    this.registerUserFromWPAndNodebb();
  }

  async toggleLike(elem: any, rec: any) {
    if (this.currentUser) {
      this.disable = true;
      try {
        if (elem.srcElement.className.includes('green')) {
          const res = await this._mainService.likeFlagImage({
            user_id: this.currentUser._id,
            image_id: rec._id,
            is_like: false,
            is_flag: false,
            api_type: 'like'
          });
          rec.total_like--;
          if (res) {
            this.disable = false;
          }
          elem.srcElement.classList.remove('green');
        } else {
          const res = await this._mainService.likeFlagImage({
            user_id: this.currentUser._id,
            image_id: rec._id,
            is_like: true,
            is_flag: false,
            api_type: 'like'
          });
          if (res) {
            this.disable = false;
          }
          elem.srcElement.classList.add('green');
          rec.total_like++;
        }
      } catch (e) {
        this.disable = false;
      }
    }
  }

  imageData() {
    const searchStr = ((this.route.snapshot.queryParams['search']) ? this.route.snapshot.queryParams['search'] : '');
    this.scrollEnable = false;
    const data = {
      imageCounter: this.imageCounter,
      promotionCounter: this.promotionCounter,
      bannerCounter: this.bannerCounter,
      user_id: this.currentUser ? this.currentUser._id : '0',
      ramdon_no: this.ramdon_no,
      searchStr: searchStr
    };
    this.isLoading = true;

    this._mainService.loadMoreImages(data)
      .subscribe((res) => {
          const imageList = res;
          if ((Number(imageList.imageData.length) === 0) && (Number(imageList.promotionData.length) === 0) && (Number(imageList.bannerData.length) === 0)) {
            this.endImage = 1;
          }
          this.promotionCounter += imageList.promotionData.length;
          this.imageCounter += imageList.imageData.length;
          if ((imageList.imageData && imageList.imageData.length > 0) || (imageList.promotionData && imageList.promotionData.length > 0) || (imageList.bannerData && imageList.bannerData.length > 0)) {
            const imageData = [];
            const promotionData = [];
            let row = 0;
            let lastKey = -1;
            imageData[row] = [];
            imageData[row]['data'] = [];
            const resImgData = imageList.imageData.map(x => Object.assign({}, x));
            const organicLastKey = imageList.imageData.length - 1;
            if (imageList.imageData.length > 0) {
              resImgData.forEach((element, key) => {
                if (Number(imageData[row]['data'].length) >= 3) {
                  row++;
                  imageData[row] = [];
                  imageData[row]['data'] = [];
                }
                element.time_stamp = new Date(element.created).getTime();
                imageData[row]['data'].push(element);

                if (Number(imageList.promotionData.length) > 0) {
                  imageList.promotionData.forEach((element1, key1) => {
                    if ((Number(imageData[row]['data'].length) < 3) && (key1 > lastKey)) {
                      element1.time_stamp = new Date(element1.created).getTime();
                      imageData[row]['data'].push(element1);
                      lastKey = key1;
                    } else if (organicLastKey === key && (key1 > lastKey)) {
                      if (Number(imageData[row]['data'].length) >= 3) {
                        row++;
                        imageData[row] = [];
                        imageData[row]['data'] = [];
                      }

                      element1.time_stamp = new Date(element1.created).getTime();
                      imageData[row]['data'].push(element1);
                      lastKey = key1;
                    }
                  });
                }

              });
            } else {
              const resImgData1 = imageList.promotionData.map(x => Object.assign({}, x));
              resImgData1.forEach((element, key) => {
                if (Number(imageData[row]['data'].length) >= 3) {
                  row++;
                  imageData[row] = [];
                  imageData[row]['data'] = [];
                }
                element.time_stamp = new Date(element.created).getTime();
                imageData[row]['data'].push(element);

              });
            }
            this.imageList = this.imageList.concat(imageData);

            let row1 = 0;
            const bannerData = [];
            bannerData[row1] = [];
            bannerData[row1]['data'] = [];
            const banner = imageList.bannerData.map(x => Object.assign({}, x));
            if ((banner && banner.length > 0)) {
              banner.forEach((element1, key1) => {
                this.bannerCounter++;
                element1.time_stamp = new Date(element1.created).getTime();
                bannerData[row1]['data'].push(element1);
                row1++;
              });
              this.imageList = this.imageList.concat(bannerData);
            }
          } else {
            this.endImage = 1;
          }
          this.scrollEnable = true;
          this.isLoading = false;
        }
      );
  }

  loginData() {
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
        this.business = op.get(res, 'data.business');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

  highlightTile(event, image_id) {
    this.image_id = image_id;
    const {[InViewportMetadata]: {entry}, target, visible} = event;
    if (visible && this.currentUser) {
      const data = {'image_id': image_id, 'user_id': this.currentUser._id, 'type': 'image', 'page': 'Home'};
      this._mainService.viewImage(data);
    }
  }

  countClick(image_id) {
    if (this.currentUser && this.currentUser._id) {
      const data = {'image_id': image_id, 'user_id': this.currentUser._id, 'duration': 0};
      this._mainService.clickImage(data);
    }
  }

  stopModalBox(event: any) {
    event.stopPropagation();
  }

  savePhoto(event: any, imageObj: any) {
    if (this.currentUser) {
      this.saveInMediabookDialog.openModal(imageObj);
    }
  }

  shareViaEmail(event: any, imageObj: any) {
    if (this.currentUser) {
      if (imageObj.title || imageObj.subject) {
        this.shareViaEmailDialogService.share(imageObj).then(async (res) => {
          try {
            await this.imageGalleryService.shareViaEmail(imageObj._id, res);
            this.alertDialog.alert('Email sent successfully.');
          } catch (e) {
            this.alertDialog.alert('Email not sent.');
            console.log('ImageGalleryComponent -> shareViaEmail :: ', e);
          }
        });
      } else {
        this.alertService.alert('This object cannot be shared since it has no title/subject.');
      }
    }
  }
}
