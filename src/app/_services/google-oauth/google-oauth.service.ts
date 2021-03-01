import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as op from 'object-path';

import {environment} from '../../../environments/environment';

declare var gapi: any;

@Injectable({providedIn: 'root'})
export class GoogleOAuthService {

  private googleAuth: any;

  constructor(private http: HttpClient) {
  }

  public loadScript() {
    const _self = this;
    return new Promise((resolve) => {
      const elementId: any = Math.random().toString(36).substring(7);
      const newScript: any = document.createElement('script');
      newScript.setAttribute('id', elementId);
      newScript.setAttribute('src', 'https://apis.google.com/js/api.js');
      newScript.setAttribute('async', '');
      newScript.setAttribute('defer', '');
      newScript.onload = function () {
        // Load the API's client and auth2 modules.
        // Call the initClient function after the modules load.
        gapi.load('client:auth2', function () {
          // Retrieve the discovery document for version 3 of Google Drive API.
          // In practice, your app can retrieve one or more discovery documents.
          const discoveryUrl: any = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

          // Initialize the gapi.client object, which app uses to make API requests.
          // Get API key and client ID from API Console.
          // 'scope' field specifies space-delimited list of access scopes.
          gapi.client.init({
            'apiKey': environment.GOOGLE_OAUTH_API_KEY,
            'clientId': environment.GOOGLE_OAUTH_CLIENT_ID,
            'discoveryDocs': [discoveryUrl],
            'scope': 'https://www.googleapis.com/auth/userinfo.profile profile email https://www.googleapis.com/auth/contacts.readonly'
          }).then(function () {
            _self.googleAuth = gapi.auth2.getAuthInstance();
            resolve();
          }).catch(function (e) {
            resolve(e);
          });
        });
      };
      newScript.onreadystatechange = function () {
        if (this.readyState === 'complete') {
          this.onload();
        }
      };
      newScript.onerror = () => {
        resolve();
      };
      document.body.appendChild(newScript);
    });
  }

  public signUp() {
    const _self = this;
    this.signOut();
    return new Promise((resolve, reject) => {
      if (this.googleAuth) {
        this.googleAuth.signIn()
          .then(function () {
            const user: any = _self.googleAuth.currentUser.get();
            const profile: any = user.getBasicProfile();
            const id: any = profile.getId();
            const email: any = profile.getEmail();
            const name: any = profile.getName();
            const nameArr: any = name.split(' ');
            const obj: any = {};
            obj.id = id ? id : '';
            obj.social_type = 'google';
            obj.email = email ? email : '';
            obj.firstName = nameArr.length && nameArr[0] ? nameArr[0] : '';
            obj.lastName = nameArr.length && nameArr[1] ? nameArr[1] : '';
            _self.signOut();
            return resolve(obj);
          })
          .catch(function (e) {
            return reject(e);
          });
      }
    });
  }

  public signIn() {
    const _self = this;
    this.signOut();
    return new Promise((resolve, reject) => {
      if (this.googleAuth) {
        this.googleAuth.signIn()
          .then(function () {
            const user: any = _self.googleAuth.currentUser.get();
            const profile: any = user.getBasicProfile();
            const authResp: any = user.getAuthResponse();
            const id: any = profile.getId();
            const email: any = profile.getEmail();
            const obj: any = {};
            obj.id = id ? id : '';
            obj.social_type = 'google';
            obj.email = email ? email : '';
            obj.access_token = authResp.access_token ? authResp.access_token : '';
            _self.signOut();
            return resolve(obj);
          })
          .catch(function (e) {
            return reject(e);
          });
      }
    });
  }

  public signOut() {
    if (this.googleAuth && this.googleAuth.isSignedIn.get()) {
      // User is authorized and has clicked "Sign out" button.
      this.googleAuth.signOut();
    }
  }

  public fetchMails() {
    return new Promise(async (resolve) => {
      const res: any = await this.signIn();
      this.http.get(`https://www.google.com/m8/feeds/contacts/default/thin?alt=json&max-results=500&v=3.0&access_token=${res.access_token}`)
        .subscribe((data) => {
          const emails: any = op.get(data, 'feed.entry', []).map((o) => {
            return op.get(o, 'gd$email.0.address');
          }).filter((o) => o).toString();
          resolve(emails);
        }, () => {
          resolve('');
        });
    });
  }
}
