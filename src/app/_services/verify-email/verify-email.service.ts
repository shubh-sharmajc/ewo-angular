import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {

  constructor(private http: HttpClient) {
  }

  sendEmailVerification(email: any) {
    return new Promise((resolve) => {
      return this.http.post<any>(`${environment.apiUrl}/verify-email`, {email: email})
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  verifyEmailToken(token: any, email) {
    return new Promise((resolve) => {
      this.http.get<any>(`${environment.apiUrl}/verify-email?verifyToken=${token}&email=${email}`)
        .subscribe((res: any) => {
          return resolve(res);
        });
    });
  }
}
