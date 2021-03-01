import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ThirdPartyCookiesComponent} from './third-party-cookies.component';

@Injectable()
export class ThirdPartyCookiesDialogService {

  private navigator: any = (<any>navigator);
  private dom: any = (<any>document);
  private data: any = [{
    os: 'Windows',
    browser: 'Chrome',
    version: '84.0',
    info: `
    <ol class="ordered-lists">
      <li>Select the Chrome menu icon</li>
      <li>Select Settings.</li>
      <li>Select 'Privacy and security' section from left side menu</li>
      <li>Select 'Cookies and other site data'.</li>
      <li>Select 'Allow all cookies'.</li>
    </ol>
    `
  }, {
    os: 'Windows',
    browser: 'Firefox',
    version: '79.0',
    info: `
    <ol class="ordered-lists">
      <li>Click Tools &gt; Options.</li>
      <li>Click Privacy in the top panel.</li>
      <li>Select the checkbox labeled ‘Accept cookies from sites.’</li>
      <li>Select the checkbox labeled ‘Accept third-party cookies.’</li>
      <li>Click OK.</li>
    </ol>
    `
  }, {
    os: 'Windows',
    browser: 'Opera',
    version: ' 69.0',
    info: `
    <ol class="ordered-lists">
      <li>Go to the Opera drop-down menu and select Go to full browser settings</li>
      <li>Select Advanced option.</li>
      <li>Go to Privacy and security.</li>
      <li>Select the site settings.</li>
      <li>Select cookies and site data.</li>
      <li>Select checkbox labeled 'Allow sites to save and read cookie data (recommended)'</li>
    </ol>
    `
  }, {
    os: 'Windows',
    browser: 'IE',
    version: '11.0',
    info: `
    <ol class="ordered-lists">
      <li>Click 'Tools' (the gear icon) in the browser toolbar.</li>
      <li>Choose Internet Options.</li>
      <li>Click the Privacy tab.</li>
      <li>Click the Advanced tab.</li>
      <li>Accept first party cookies and third party cookies</li>
      <li>Select Always allow session cookies</li>
    </ol>
    `
  }, {
    os: 'MacOS',
    browser: 'Chrome',
    version: '84.0',
    info: `
    <ol class="ordered-lists">
      <li>Open Chrome preferences click on Settings, then Show Advanced Settings.</li>
      <li>Under Privacy, click on Content Settings.</li>
      <li>Make sure “Block third-party cookies and site data” is not checked.</li>
      <li>If your browser is not listed above, please refer to your browser’s help pages.</li>
    </ol>
    `
  }, {
    os: 'MacOS',
    browser: 'Firefox',
    version: '79.0',
    info: `
    <ol class="ordered-lists">
      <li>Go to the Firefox drop-down menu.</li>
      <li>Select Preferences.</li>
      <li>Click Privacy.</li>
      <li>Under Cookies, select the option ‘Accept cookies from sites.’</li>
    </ol>
    `
  }, {
    os: 'MacOS',
    browser: 'Safari',
    version: '5.1.7',
    info: `
    <ol class="ordered-lists">
      <li>Choose Safari > Preferences</li>
      <li>Click Privacy</li>
      <li>Click Privacy.</li>
      <li>Select option ‘Accept cookies from sites.’</li>
    </ol>
    `
  }, {
    os: 'MacOS',
    browser: 'Opera',
    version: '68.0',
    info: `
    <ol class="ordered-lists">
      <li>In the top right corner of the Opera window, select the "Easy Setup" button.</li>
      <li>Search for "cookie"</li>
      <li>Click "Site Settings"</li>
      <li>Click "Cookies"</li>
    </ol>
    `
  }, {
    os: 'Linux',
    browser: 'Chrome',
    version: '84.0',
    info: `
    <ol class="ordered-lists">
      <li>In the top right corner of the Opera window, select the "Easy Setup" button.</li>
      <li>Search for "cookie"</li>
      <li>Click "Site Settings"</li>
      <li>Click "Cookies"</li>
    </ol>
    `
  }, {
    os: 'Linux',
    browser: 'Firefox',
    version: '79.0',
    info: `
    <ol class="ordered-lists">
      <li>Click on the More actions button in the top right corner and select Settings</li>
      <li>Click View Advanced Settings. You’ll need to scroll down to the bottom of the page.</li>
      <li>Press the dropdown arrow under the Cookies field.</li>
      <li>Select allow cookies.</li>
    </ol>
    `
  }];

  constructor(public dialog: MatDialog) {
  }

  private getBrowser() {
    if ((this.navigator.userAgent.indexOf('Opera') || this.navigator.userAgent.indexOf('OPR')) !== -1) {
      return 'Opera';
    } else if (this.navigator.userAgent.indexOf('Chrome') !== -1) {
      return 'Chrome';
    } else if (this.navigator.userAgent.indexOf('Safari') !== -1) {
      return 'Safari';
    } else if (this.navigator.userAgent.indexOf('Firefox') !== -1) {
      return 'Firefox';
    } else if ((this.navigator.userAgent.indexOf('MSIE') !== -1) || (!!this.dom.documentMode === true)) {
      return 'IE';
    } else {
      return null;
    }
  }

  private getOS() {
    let OSName = null;
    if (this.navigator.appVersion.indexOf('Win') !== -1) {
      OSName = 'Windows';
    } else if (this.navigator.appVersion.indexOf('Mac') !== -1) {
      OSName = 'MacOS';
    } else if (this.navigator.appVersion.indexOf('X11') !== -1) {
      OSName = 'UNIX';
    } else if (this.navigator.appVersion.indexOf('Linux') !== -1) {
      OSName = 'Linux';
    }
    return OSName;
  }

  private getData() {
    const bName: any = this.getBrowser();
    const os: any = this.getOS();
    return this.data.find((o: any) => {
      return os.includes(o.os) && bName.includes(o.browser);
    });
  }

  public openModal() {
    const data: any = this.getData();
    if (!this.navigator.cookieEnabled && data && !document.getElementsByClassName('third-party-cookies-dialog').length) {
      this.dialog.open(ThirdPartyCookiesComponent, {
        height: '500px',
        width: '500px',
        disableClose: true,
        panelClass: 'third-party-cookies-dialog',
        data
      });
    }
  }
}
