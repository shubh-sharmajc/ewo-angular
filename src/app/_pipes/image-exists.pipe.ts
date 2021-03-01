import { Pipe, PipeTransform } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { catchError, retryWhen, mergeMap,delay } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';

@Pipe({ name: 'imageExists' })
export class ImageExists implements PipeTransform {
  constructor(private http: HttpClient) {}
  transform(url: string,fallback): any {
    if (url) {
      return this.http
          .get(url).pipe(delayedRetry(3000,5),
          catchError(res => {
            if(res =='Received') {
              return of(url);
            } else {
              return of(fallback);
            }
          })
        );
    } else {
      return of(false);
    }
  }
}
function delayedRetry(delaytime, times){
  let tries = times; 
  return (url:Observable<any>) => url.pipe(retryWhen((errors:Observable<any>)=>errors.pipe(
    mergeMap(res =>{
      if (res['status'] == 200) {
        return throwError('Received');
      } else if (tries-- > 0){
        return of(res);
      } else {
        return throwError('Not found');
      } 
    }),delay(delaytime))));  
}
