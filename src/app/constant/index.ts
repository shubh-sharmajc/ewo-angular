import {AbstractControl, FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import * as op from 'object-path';

export const COOKIE_NAME: any = 'auth_token';
export const ALL_USER_ROLES: any[] = ['author', 'user_basic', 'user-premium', 'content_team', 'access', 'pro-basic', 'pro-premium'];
export const USER_ROLES: any[] = ['author', 'user_basic', 'user-premium', 'content_team', 'access'];
export const PRO_USER_ROLES: any[] = ['pro-basic', 'pro-premium'];
export const DATE_FORMAT: any = 'MM DD YYYY';
export const DATE_FORMAT2: any = 'MMM DD YYYY';

export class DateValidator {
  static dateValidator(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, 'MM DD YYYY', true).isValid()) {
      return {'dateValidator': true};
    }
    return null;
  }
}

export class EmailsValidator {
  static emailsValidator(AC: AbstractControl) {
    if (AC.value) {
      const emails = AC.value.split(',');
      const forbidden = emails.map(email => email ? Validators.email(new FormControl(email)) : {email: true}).find((o) => o && o.email);
      if (op.get(forbidden, 'email', false)) {
        return {emailsValidator: true};
      }
      return null;
    }
    return null;
  }
}

export class SpaceValidator {
  static cannotContainSpace(control: any): any | null {
    if (control.value.trim() === '') {
      return {cannotContainSpace: true};
    }
    return null;
  }
}
