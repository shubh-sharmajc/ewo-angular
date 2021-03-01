import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {isPlatformBrowser} from '@angular/common';

import {AppState} from '../../../app.state';
import {SignUpDialogService} from '../../../modal/sign-up-popup/sign-up-dialog.service';
import {ConfigurationService} from '../../../_services/configuration/configuration.service';

declare var $: any;

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss']
})
export class MarketingComponent implements OnInit, OnDestroy {

  public efData: any;
  public destroy$: any = new Subject<any>();
  public catWellnessArr: any[] = [
    {name: 'Beauty & Antiaging', img: 'assets/img/category/beauty.svg'},
    {name: 'Nutrition', img: 'assets/img/category/nutrition.svg'},
    {name: 'Weight Loss', img: 'assets/img/category/weight-loss.svg'},
    {name: 'Fitness', img: 'assets/img/category/fitness.svg'},
    {name: 'Mind-Body', img: 'assets/img/category/body2.svg'},
    {name: 'Spas & Reports', img: 'assets/img/category/spa.svg'},
    {name: 'Workplace Wellness', img: 'assets/img/category/workplace.svg'},
    {name: 'Wellness Tourism', img: 'assets/img/category/mountain.svg'},
    {name: 'Preventive Medicine', img: 'assets/img/category/bmi.svg'},
    {name: 'Thermal & Mineral Springs', img: 'assets/img/category/thermal.svg'},
    {name: 'Wellness Lifestyle', img: 'assets/img/category/007-lotus.svg'},
    {name: 'Alternative Medicine', img: 'assets/img/category/spa.svg'},
  ];

  constructor(@Inject(PLATFORM_ID) private platformId,
              private store: Store<AppState>,
              public signUpDialogService: SignUpDialogService,
              private configurationService: ConfigurationService) {
  }

  ngOnInit() {
    this.getExploreFeaturesPageInfo();
  }

  async getExploreFeaturesPageInfo() {
    this.store.select('config')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data && data.exploreFeature) {
          this.efData = data.exploreFeature;
        }
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.initSlider();
          }, 750);
        }
      });
    await this.configurationService.getExploreFeatures();
  }

  initSlider() {
    // tabbed content

    $('.tab_content').hide();
    $('.tab_content:first').show();

    /* if in tab mode */
    $('ul.tabs li').click(function () {

      $('.tab_content').hide();
      var activeTab = $(this).attr('rel');
      $('#' + activeTab).fadeIn();

      $('ul.tabs li').removeClass('active');
      $(this).addClass('active');

      $('.tab_drawer_heading').removeClass('d_active');
      $('.tab_drawer_heading[rel^=\'' + activeTab + '\']').addClass('d_active');

      /*$(".tabs").css("margin-top", function(){
         return ($(".tab_container").outerHeight() - $(".tabs").outerHeight() ) / 2;
      });*/
    });
    $('.tab_container').css('min-height', function () {
      return $('.tabs').outerHeight() + 50;
    });
    /* if in drawer mode */
    $('.tab_drawer_heading').click(function () {

      $('.tab_content').hide();
      var d_activeTab = $(this).attr('rel');
      $('#' + d_activeTab).fadeIn();

      $('.tab_drawer_heading').removeClass('d_active');
      $(this).addClass('d_active');

      $('ul.tabs li').removeClass('active');
      $('ul.tabs li[rel^=\'' + d_activeTab + '\']').addClass('active');
    });


    /* Extra class "tab_last"
       to add border to bottom side
       of last tab
    $('ul.tabs li').last().addClass("tab_last");*/


    /*Menu*/
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

    /*Finish Menu*/

    $(document).on('click', '.js-menu_toggle.opened', function (e) {
      e.preventDefault();
      $('.list_load, .list_item').stop();
      $(this).removeClass('opened').addClass('closed');
      $('.side_menu').css({
        'left': '-340px'
      });
      var count = $('.list_item').length;
      $('.list_item').css({
        'opacity': '0',
        'margin-left': '-20px'
      });
      $('.list_load').slideUp(300);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
