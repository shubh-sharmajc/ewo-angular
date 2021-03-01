import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/internal/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as op from 'object-path';

import { ProUserService } from '../../../../_services/pro-user/pro-user.service';
import { ActivatedRoute } from '@angular/router';
import { CustomvalidationService } from '../../../../_helpers/customvalidation.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit, OnDestroy {

  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  @Output() pause = new EventEmitter<any>();
  @Input() newUser: any;
  @Input() editUser: any;
  public socialMediaForm: FormGroup;
  public smSubmitted: any;
  public proUser: any;
  private business: any;
  public destroy$: any = new Subject<any>();
  public locationId: any;
  public selectedLoc: any;
  public submitted: boolean;
  public socialLinkArr: any[] = [
    { name: 'Facebook', src: 'assets/img/social-icons/facebook.svg' },
    { name: 'Twitter', src: 'assets/img/social-icons/twiiter.svg' },
    { name: 'LinkedIn', src: 'assets/img/social-icons/linkdin.svg' },
    { name: 'Instagram', src: 'assets/img/social-icons/instagram.svg' },
    { name: 'YouTube', src: 'assets/img/social-icons/youtube.svg' },
  ];

  constructor(private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: Store<any>,
    private proUserService: ProUserService,
    private customValidator: CustomvalidationService) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.locationId = op.get(params, 'locId');
        if (this.socialMediaForm) {
          this.updateLocationData();
        }
      });
  }

  ngOnInit() {
    this.createSocialMediaForm();
    this.getProUser();
  }

  // slChangeEvent() {
  //   const selectedSL: any = this.socialMediaForm.get('selectedSL');
  //   let social_links = op.get(this.selectedLoc, 'location.social_links', selectedSL.value);
  //   if (op.get(this.selectedLoc, 'location.social_links')) {
  //     social_links = social_links.filter((o) => selectedSL.value.indexOf(o.name) > -1);
  //     this.updateSocialLinks(social_links);
  //   }
  // }
  slChangeEvent() {
    const selectedSL: any = this.socialMediaForm.get('selectedSL');
    const social_links: any = op.get(this.selectedLoc, 'location.social_links', this.socialLinkArr);
    let filterSL: any = [];
    if (social_links.length) {
      filterSL = social_links.filter((o) => selectedSL.value.indexOf(o.name) > -1);
    } else {
      filterSL = this.socialLinkArr.filter((o) => selectedSL.value.indexOf(o.name) > -1);
    }
    this.updateSocialLinks(filterSL);
  }

  updateForm() {
    this.updateSocialLinks();
    this.updateSelectedSL();
    this.socialMediaForm.markAsPristine();
  }

  get smF() {
    return this.socialMediaForm.get('social_links') as FormArray;
  }

  createSocialMediaForm() {
    this.socialMediaForm = this.formBuilder.group({
      social_links: this.formBuilder.array([]),
      selectedSL: [],
      btnName: ['Save', []]
    });
  }

  createSocialMediaFormData(social_link?: any, seq?: any): FormGroup {
    return this.formBuilder.group({
      _id: op.get(social_link, '_id', null),
      name: [<any>op.get(social_link, 'name', '')],
      link: [<any>op.get(social_link, 'link', ''), Validators.compose([this.customValidator.patternValidator(social_link.name)])],
      seq: <any>op.get(social_link, 'seq', seq + 1)
    });
  }
  addIconToFormArray(name: string, i: number, event) {
    if (event.target.checked) {
      let o = {
        _id: null,
        name: name,
        link: '',
        seq: i + 1
      };
      let socialValues = this.socialMediaForm.value.social_links;
      if (socialValues.filter(link => link.name == name).length == 0) {
        this.smF.push(this.createSocialMediaFormData(o, i + 1));
        this.socialMediaForm.value.social_links.sort((a, b) => (a.seq > b.seq) ? 1 : -1);
        let prevoiusValues = JSON.stringify(this.socialMediaForm.value.social_links);
        for (let i = this.smF.length - 1; i >= 0; i--) {
          this.smF.removeAt(i);
        }
        let jsonValues = JSON.parse(prevoiusValues);
        jsonValues.forEach((obj, index) => {
          this.smF.push(this.createSocialMediaFormData(obj, index + 1));
        });
      }
    } else {
      let socialValues = this.socialMediaForm.value.social_links;
      let findedIndex = socialValues.findIndex(link => link.name == name);
      if (findedIndex != -1)
        this.smF.removeAt(findedIndex);
    }
  }
  updateSocialLinks(sl?: any) {
    // Clear form array
    for (let i = this.smF.length - 1; i >= 0; i--) {
      this.smF.removeAt(i);
    }
    const social_links: any = sl ? sl : op.get(this.selectedLoc, 'location.social_links', []);
    if (social_links.length) {
      social_links.forEach((o: any, i: any) => {
        this.smF.push(this.createSocialMediaFormData(o, i));
      });
    }
    this.smF.markAsPristine();
  }

  updateSelectedSL() {
    const selectedSL: any[] = [];
    const social_links: any = op.get(this.selectedLoc, 'location.social_links', []);
    if (social_links.length) {
      social_links.forEach((o: any) => {
        selectedSL.push(o.name);
      });
    }
    this.socialMediaForm.patchValue({ selectedSL });
    this.socialMediaForm.markAsPristine();
  }

  isSocialSelected(socialName: string) {
    const social_links: any = op.get(this.selectedLoc, 'location.social_links', []);
    let filterArray = social_links.filter(key => key.name == socialName)
    return filterArray && filterArray.length > 0 ? true : false;
  }

  updateLocationData() {
    const bLocation: any = op.get(this.business, 'locations', []);
    this.selectedLoc = bLocation.find((o: any) => {
      return this.locationId ? this.locationId === op.get(o, 'location._id') : o.is_default;
    });
    this.updateForm();
  }

  resetBtnName() {
    this.socialMediaForm.patchValue({ btnName: 'Save' });
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          if (this.socialMediaForm.get('btnName').value === 'Saving') {
            this.socialMediaForm.patchValue({ btnName: 'Saved' });
          }
          this.proUser = res.proUser;
          this.business = op.get(res.proUser, 'business');
          this.updateLocationData();
        }
      });
  }

  pauseEvent() {
    const payload: any = this.onSMSubmit();
    if (payload) {
      payload.paused_step = 3;
      this.pause.emit(payload);
    }
  }

  previousEvent() {
    const payload: any = this.onSMSubmit();
    if (payload) {
      payload.paused_step = 2;
      this.previous.emit(payload);
    }
  }

  get f() {
    return this.socialMediaForm.controls;
  }

  nextEvent() {
    const payload: any = this.onSMSubmit();
    if (payload) {
      payload.paused_step = 4;
      this.next.emit(payload);
    }
  }

  saveSMS() {
    this.submitted = true;
    if (this.socialMediaForm.valid) {
      const payload: any = this.onSMSubmit();
      if (payload) {
        this.socialMediaForm.markAsPristine();
        this.socialMediaForm.patchValue({ btnName: 'Saving' });
        this.next.emit(payload);
      }
    }
  }

  onSMSubmit() {
    if (!this.smSubmitted) {
      this.smSubmitted = true;
    }

    // stop here if form is invalid
    if (this.socialMediaForm.invalid) {
      return;
    }
    const formData: any = this.socialMediaForm.getRawValue();
    return { social_links: formData.social_links, social_form: true };
  }

  async autoSave() {
    if (this.newUser) {
      const payload: any = this.onSMSubmit();
      if (payload) {
        const location: any = op.get(this.selectedLoc, 'location');
        const locID: any = op.get(location, '_id');
        await this.proUserService.updateProUser(this.proUser._id, locID, payload);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
