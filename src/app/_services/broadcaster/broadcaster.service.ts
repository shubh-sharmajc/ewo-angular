import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcasterService {

  public isShowMyInfo: BehaviorSubject<any> = new BehaviorSubject(true);

  constructor() {
  }

  public showMyInfoView(value) {
    this.isShowMyInfo.next(value);
  }
}
