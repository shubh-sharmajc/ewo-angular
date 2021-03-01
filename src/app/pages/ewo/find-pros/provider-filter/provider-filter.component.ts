import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import {ProUserService} from '../../../../_services/pro-user/pro-user.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-provider-filter',
  templateUrl: './provider-filter.component.html',
  styleUrls: ['./provider-filter.component.scss']
})
export class ProviderFilterComponent implements OnInit, OnDestroy {

  public destroy$: any = new Subject<any>();
  public categoriesList: any[] = [];
  public searchKeyword: any;

  constructor(
    private proUserService: ProUserService,
    @Inject(MAT_DIALOG_DATA) public data: ProviderFilterComponent) {}
    tabnames = 'tops';
    tabname = 'top';
    checkbox ='check4';
  ngOnInit(){
    //this.findCategories();
  }

  tabchange(p){
    this.tabname = p;
  }
  sectabchange(p){
    this.tabnames = p;
  }
  radio(p){
    this.checkbox = p;
  }
//  findCategories() {
//     try {
//       const proCategoryData: any = this.proUserService.getCategories();
//      this.categoriesList = proCategoryData.data[0].data
//      .map((o: any) => {
//       //  o.shared = o.created_by._id !== this.currentUser._id;
//       //  o.sharingAccess = o.sharing.find((s: any) => s.user && s.user._id === this.currentUser._id);
//        return o;
//      });
//      console.log(this.categoriesList);
//     } catch (e) {
//       console.error('FindProsDetailsComponent -> findProviders', e);
//     }
//   }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
