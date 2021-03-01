import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  patternValidator(socialName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      let regex, valid;

      switch (socialName) {
        case 'Facebook':
          regex = new RegExp('(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?');
          valid = regex.test(control.value);
          return valid ? null : { invalidUrl: true };
          break;
        case 'LinkedIn':
          regex = new RegExp('(?:(?:http|https):\/\/)?(?:www.)?linkedin.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?');
          valid = regex.test(control.value);
          return valid ? null : { invalidUrl: true };
          break;
        case 'Twitter':
          regex = new RegExp('(?:(?:http|https):\/\/)?(?:www.)?twitter.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?');
          valid = regex.test(control.value);
          return valid ? null : { invalidUrl: true };
          break;
        case 'Instagram':
          regex = new RegExp('(?:(?:http|https):\/\/)?(?:www.)?instagram.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?');
          valid = regex.test(control.value);
          return valid ? null : { invalidUrl: true };
          break;
        case 'Youtube':
          regex = new RegExp('(?:(?:http|https):\/\/)?(?:www.)?youtube.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?');
          valid = regex.test(control.value);
          return valid ? null : { invalidUrl: true };
          break;
        default:
          break;
      }



    };
  }
}
