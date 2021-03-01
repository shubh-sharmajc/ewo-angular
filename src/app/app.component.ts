import {AfterViewInit, Component, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';
import * as op from 'object-path';

import {SignUpPopupTimerService} from './_services/sign-up-popup-timer/sign-up-popup-timer.service';
import {AuthService} from './_services/auth/auth.service';
import {SignUpDialogService} from './modal/sign-up-popup/sign-up-dialog.service';
import {environment} from '../environments/environment';
import {ThirdPartyCookiesDialogService} from './modal/third-party-cookies/third-party-cookies-dialog.service';
import {ProUserTimerService} from './_services/pro-user-timer/pro-user-timer.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {PRO_USER_ROLES} from './constant';

declare var gtag;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  public title = 'ewo-front';
  public currentUser: any;
  public proUser: any;
  public destroy$: any = new Subject<any>();
  public isPageLoaded: any = false;

  constructor(@Inject(PLATFORM_ID) private platformId,
              private injector: Injector,
              public router: Router,
              private store: Store<any>,
              private spinner: NgxSpinnerService,
              private _auth: AuthService,
              private supTimerService: SignUpPopupTimerService,
              private proUserTimerService: ProUserTimerService,
              private signUpDialogService: SignUpDialogService,
              private thirdPartyCookiesDialog: ThirdPartyCookiesDialogService) {
  }

  ngOnInit() {
    this.getProUser();
    if (isPlatformBrowser(this.platformId)) {
      this.injector.get(NgcCookieConsentService);
      this.supTimerService.stopTimer();
      this.router.events
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (event: any) => {
          if (event instanceof NavigationStart) {
            this.supTimerService.stopTimer();
            this.proUserTimerService.stopTimer();
          }
          if (event instanceof NavigationEnd) {
            const is_complete: any = op.get(this.proUser, 'business.is_complete');
            const role: any = op.get(this.proUser, 'role');
            if (PRO_USER_ROLES.indexOf(role) > -1 && !is_complete && !event.url.includes('growth')
              && !event.url.includes('resume-registration')) {
              this.router.navigate(['/pro/resume-registration']);
            }
            this.showCookieConsentOnHome(event.url === '/');
            if (event.url.includes('logout=logout')) {
              await this._auth.logout();
              window.location.href = `${environment.SITE_URL}/signin`;
            }
            if (!this._auth.getToken() && event.url !== '/' && !event.url.includes('signin')) {
              this.supTimerService.startTimer(1000 * 60, 1000 * 60);
            }
            if (!this.currentUser) {
              gtag('config', 'UA-152753552-1', {
                page_path: event.urlAfterRedirects
              });
            } else {
              gtag('config', 'UA-152753552-1', {
                user_id: this.currentUser._id,
                page_path: event.urlAfterRedirects
              });
            }
            if (isPlatformBrowser(this.platformId)) {
              setTimeout(() => {
                this.isPageLoaded = true;
                this.enableJqueryEvent();
              }, 100);
            }
          }
        });
      setTimeout(() => {
        this.thirdPartyCookiesDialog.openModal();
      }, 100);
    }
  }

  ngAfterViewInit() {
    this.supTimerService.onTimeout()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.signUpDialogService.openModal();
      });
    this.proUserTimerService.onTimeout()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async () => {
        this.proUserTimerService.stopTimer();
        this.spinner.show();
        await this._auth.logout();
        this.spinner.hide();
        this.router.navigate(['/signin']);
      });
    this.store.select('loginUser')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentUser = _.isObject(res) && _.isObject(res.data) && res.data ? res.data : null;
      });
  }

  enableJqueryEvent() {
    $(document).ready(function () {
      // Bottom to ScrollTop
      $('#backToTop').on('click', function (e) {
        e.preventDefault();
        const target = this.hash,
          $target = $(target);
        $('html, body').stop().animate({
          'scrollTop': '0px'
        }, 1000, 'swing', function () {
        });
      });

      // Scroll to Top
      function removeClass(scroll) {
        if (scroll >= 300 && $(window).width() > '') {
          // $(".showFooter").addClass("active1 fadeInRight animated1");
          $('.goTop').addClass('active fadeInRight animated1');
        } else {
          // $(".showFooter").removeClass("active1 fadeInRight animated1 buttonNone");
          $('.goTop').removeClass('active fadeInRight animated1');
        }
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          //  $(".showFooter").addClass("buttonNone");
        }
      }

      $(window).resize(function () {
        const scroll = $(window).scrollTop();
        removeClass(scroll);
      });

      $(window).scroll(function () {
        const scroll = $(window).scrollTop();
        removeClass(scroll);
      });
    });
    $(document).on('click', '.js-menu_toggle.closed', function (e) {
      e.preventDefault();
      $('.list_load, .list_item').stop();
      $(this).removeClass('closed').addClass('opened');

      $('.side_menu').css({
        'left': '0px'
      });
    });

    $(document).on('click', '.js-menu_toggle.opened', function (e) {
      e.preventDefault();
      $('.list_load, .list_item').stop();
      $(this).removeClass('opened').addClass('closed');

      $('.side_menu').css({
        'left': '-340px'
      });
    });


    $(document).ready(function () {
      $('.nav').click(function () {
        $('.nav').toggleClass('is-active');
        $('.navigation-part').toggleClass('is-active2');
      });
    });

    $(document).ready(function () {
      $('.searchicon').click(function () {
        $('.moblieSearch').toggleClass('searchfull');
        $('.closeSearch').removeClass('searchfull');
        $('.mobileview').addClass('search-open');
      });
    });

    $(document).ready(function () {
      $('.closeSearch').click(function () {
        $('.moblieSearch').removeClass('searchfull');
        $('.mobileview').removeClass('search-open');
      });
    });
  }

  showCookieConsentOnHome(isHomePage) {
    const cols: any = document.getElementsByClassName('cc-revoke cc-bottom cc-animate');
    for (let i = 0; i < cols.length; i++) {
      cols[i].style.display = isHomePage ? null : 'none';
    }
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.proUser = op.get(res, 'proUser');
        // const user: any = op.get(res, 'proUser');
        // const business: any = op.get(user, 'business');
        // const is_complete: any = op.get(business, 'is_complete');
        // const is_paused: any = op.get(business, 'is_paused');
        // if (!is_complete && is_paused) {
        //   const paused_at: any = op.get(business, 'paused_at');
        //   if (paused_at) {
        //     const now: any = moment();
        //     const then: any = moment(paused_at);
        //     const ms: any = moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(then, 'DD/MM/YYYY HH:mm:ss'));
        //     const duration: any = moment.duration(ms);
        //     const minutes: any = duration.minutes();
        //     if (minutes <= 15) {
        //       const seconds: any = (15 - minutes) * 60;
        //       this.proUserTimerService.startTimer(1000 * seconds, 1000 * seconds);
        //     }
        //   }
        // }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
