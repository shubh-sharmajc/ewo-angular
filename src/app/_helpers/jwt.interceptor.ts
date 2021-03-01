import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/internal/operators';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';
import {AuthService} from '../_services/auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private _router: Router,
              private _auth: AuthService) {


  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this._auth.getToken() && !request.headers.has('Authorization') && !request.url.includes('uploads/thumb')) {
      if (request.url.startsWith(environment.apiUrl)) {
        request = request.clone({
          setHeaders: {
            Authorization: `${this._auth.getToken()}`
          }
        });
      }
    }
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
        }
      }, (error: any) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              this._auth.nodeBBAndWPLogout();
              this._auth.removeToken();
              this._router.navigate(['/signin']);
              break;
            case 403:
              console.error('STATUS CODE :: 403 =>', error.error);
              this._router.navigate(['/']);
              break;
            default:
            // console.error('InterceptorService => ', error.status);
          }
        }
      })
    );
  }
}
