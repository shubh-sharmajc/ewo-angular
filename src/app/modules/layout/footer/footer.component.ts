import {Component, HostListener, OnInit} from '@angular/core';

import {environment} from '../../../../environments/environment';
import {MainService} from '../../../_services/main.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
@HostListener('window:scroll', [])
export class FooterComponent implements OnInit {
  public showFooter = false;
  public showFooterBtn = false;
  public showBtn: boolean = true;
  public WP_LINK = `${environment.WP_LINK}`;
  public year = new Date().getFullYear();

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.scrollY >= 300) {
      this.showFooterBtn = true;
    } else {
      this.showFooterBtn = false;
      this.showFooter = false;
    }
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.showFooter = false;
      this.showFooterBtn = false;
    }
  }

  constructor(private _mainService: MainService) {
  }

  ngOnInit() {
    this.checkMobileMenu();
  }

  // check mobile right is open or not
  checkMobileMenu() {
    this._mainService.isMobileMenuOpen.subscribe((data) => {
      if (data.mobileMenu) {
        this.showBtn = false;
      } else {
        this.showBtn = true;
      }
    });
  }

}
