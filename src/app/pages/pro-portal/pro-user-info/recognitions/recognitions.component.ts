import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/internal/operators';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import * as moment from 'moment';
import * as op from 'object-path';

import {DATE_FORMAT, DATE_FORMAT2, DateValidator} from '../../../../constant';
import {BusinessService} from '../../../../_services/business/business.service';

@Component({
  selector: 'app-recognitions',
  templateUrl: './recognitions.component.html',
  styleUrls: ['./recognitions.component.scss']
})
export class RecognitionsComponent implements OnInit, OnDestroy {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  @Input() newUser: any;
  @Input() editUser: any;
  public recognitionForm: FormGroup;
  public business: any;
  public proUser: any;
  public destroy$: any = new Subject<any>();
  public isAddMore: any = false;

  constructor(private formBuilder: FormBuilder, private businessService: BusinessService, private store: Store<any>) {
  }

  ngOnInit() {
    this.createRecognitionsForm();
    this.getProUser();
  }

  createRecognitionsForm() {
    this.recognitionForm = this.formBuilder.group({
      recognitions: this.formBuilder.array([])
    });
  }

  createRecognitionsFormData(recognition?: any): FormGroup {
    let provided_at: any = op.get(recognition, 'provided_at', '');
    if (provided_at) {
      provided_at = moment(provided_at).format(DATE_FORMAT);
    }
    return this.formBuilder.group({
      _id: op.get(recognition, '_id', null),
      org: [<any>op.get(recognition, 'org', ''), Validators.maxLength(70)],
      tagline: [<any>op.get(recognition, 'tagline', ''), Validators.maxLength(70)],
      provided_at: [provided_at, [DateValidator.dateValidator]],
      seq: 0,
      isDateEdit: [false],
      btnName: <any>op.get(recognition, 'btnName', 'Save')
    });
  }

  toggleDateView(intIndex: any, isDateEdit: any) {
    this.recognitionsF.at(intIndex).patchValue({isDateEdit: !isDateEdit});
    setTimeout(() => {
      const inputEle: any = document.getElementById(`dateProvided${intIndex}`);
      if (inputEle) {
        inputEle.focus();
      }
    }, 100);
  }

  getConvertedDate(d: string) {
    return d ? moment(d, DATE_FORMAT).format(DATE_FORMAT2) : DATE_FORMAT;
  }

  get f() {
    return this.recognitionForm.controls;
  }

  get recognitionsF() {
    return this.recognitionForm.get('recognitions') as FormArray;
  }

  restAllSaveBtnName(name: any = 'Save') {
    for (let i = this.recognitionsF.length - 1; i >= 0; i--) {
      this.recognitionsF.at(i).patchValue({btnName: name});
    }
  }

  async addRecognitions() {
    this.recognitionsF.push(this.createRecognitionsFormData());
    const data = this.recognitionForm.getRawValue();
    this.isAddMore = true;
    this.restAllSaveBtnName('');
    await Promise.all(
      op.get(data, 'recognitions', [])
        .map(async (o) => {
          o.provided_at = o.provided_at ? moment(o.provided_at, DATE_FORMAT).valueOf() : '';
          if (o._id) {
            return await this.businessService.updateRecognitions(op.get(this.business, '_id'), o);
          } else {
            delete o._id;
            return await this.businessService.addRecognitions(op.get(this.business, '_id'), o);
          }
        })
    );
    this.isAddMore = false;
    this.restAllSaveBtnName();
    this.next.emit();
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.proUser = res.proUser;
          this.business = op.get(res.proUser, 'business');
          this.updateRecognitionsForm();
        }
      });
  }

  resetRecognitionsForm(intIndex: any) {
    const recognitions: any = op.get(this.business, 'recognitions', []);
    const data: any = recognitions[intIndex];
    if (data) {
      let provided_at: any = op.get(data, 'provided_at', '');
      if (provided_at) {
        provided_at = moment(provided_at).format(DATE_FORMAT);
      }
      data.org = op.get(data, 'org', '');
      data.tagline = op.get(data, 'tagline', '');
      data.provided_at = provided_at;
      data.isDateEdit = false;
      data.btnName = 'Save';
      this.recognitionsF.at(intIndex).patchValue(data);
      this.recognitionForm.markAsPristine();
    }
  }

  updateRecognitionsForm() {
    const rObj: any = {};
    for (let i = this.recognitionsF.length - 1; i >= 0; i--) {
      rObj[i] = this.recognitionsF.at(i).value;
      this.recognitionsF.removeAt(i);
    }
    const recognitions: any = op.get(this.business, 'recognitions', []);
    if (recognitions.length) {
      recognitions.forEach((o: any, i: any) => {
        o.btnName = op.get(rObj, `${i}.btnName`, 'Save');
        this.recognitionsF.push(this.createRecognitionsFormData(o));
      });
    } else {
      this.recognitionsF.push(this.createRecognitionsFormData());
    }
    this.recognitionForm.markAsPristine();
  }

  resetBtnName(intIndex) {
    this.recognitionsF.at(intIndex).patchValue({btnName: 'Save'});
  }

  async saveRecognition(fg: any, intIndex: any) {
    // stop here if form ctrl is invalid
    if (fg.invalid) {
      return;
    }

    const data = op.get(this.recognitionForm.getRawValue(), 'recognitions', []);
    const payload: any = data[intIndex];
    if (payload) {
      delete payload.isDateEdit;
      delete payload.btnName;
      this.recognitionsF.at(intIndex).patchValue({btnName: 'Saving'});
      fg.markAsPristine();
      if (payload._id) {
        await this.businessService.updateRecognitions(op.get(this.business, '_id'), payload);
      } else {
        delete payload._id;
        await this.businessService.addRecognitions(op.get(this.business, '_id'), payload);
      }
      this.recognitionsF.at(intIndex).patchValue({btnName: 'Saved'});
      this.next.emit();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }

}
