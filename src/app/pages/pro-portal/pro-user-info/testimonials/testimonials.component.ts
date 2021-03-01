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
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit, OnDestroy {

  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  @Input() newUser: any;
  @Input() editUser: any;
  public testimonialForm: FormGroup;
  public proUser: any;
  public business: any;
  public destroy$: any = new Subject<any>();
  public isAddMore: any = false;

  constructor(private formBuilder: FormBuilder, private businessService: BusinessService, private store: Store<any>) {
  }

  ngOnInit() {
    this.createTestimonialForm();
    this.getProUser();
  }

  createTestimonialForm() {
    this.testimonialForm = this.formBuilder.group({
      testimonials: this.formBuilder.array([])
    });
  }

  get testimonialsF() {
    return this.testimonialForm.get('testimonials') as FormArray;
  }

  get f() {
    return this.testimonialForm.controls;
  }

  resetTestimonialForm(intIndex: any) {
    const testimonials: any = op.get(this.business, 'testimonials', []);
    const data: any = testimonials[intIndex];
    if (data) {
      let provided_at: any = op.get(data, 'provided_at', '');
      if (provided_at) {
        provided_at = moment(provided_at).format(DATE_FORMAT);
      }
      data.testimonial = op.get(data, 'testimonial', '');
      data.provider = op.get(data, 'provider', '');
      data.relationship = op.get(data, 'relationship', '');
      data.provided_at = provided_at;
      data.isDateEdit = false;
      data.btnName = 'Save';
      this.testimonialsF.at(intIndex).patchValue(data);
      this.testimonialForm.markAsPristine();
    }
  }

  updateTestimonialForm() {
    const tObj: any = {};
    // Clear form array
    for (let i = this.testimonialsF.length - 1; i >= 0; i--) {
      tObj[i] = this.testimonialsF.at(i).value;
      this.testimonialsF.removeAt(i);
    }
    const testimonials: any = op.get(this.business, 'testimonials', []);
    if (testimonials.length) {
      testimonials.forEach((o: any, i: any) => {
        o.btnName = op.get(tObj, `${i}.btnName`, 'Save');
        this.testimonialsF.push(this.createTestimonialFormData(o));
      });
    } else {
      this.testimonialsF.push(this.createTestimonialFormData());
    }
    this.testimonialForm.markAsPristine();
  }

  createTestimonialFormData(testimonial?: any): FormGroup {
    let provided_at: any = op.get(testimonial, 'provided_at', '');
    if (provided_at) {
      provided_at = moment(provided_at).format(DATE_FORMAT);
    }
    return this.formBuilder.group({
      _id: op.get(testimonial, '_id', null),
      testimonial: [<any>op.get(testimonial, 'testimonial', ''), Validators.maxLength(200)],
      provider: [<any>op.get(testimonial, 'provider', ''), Validators.maxLength(30)],
      relationship: [<any>op.get(testimonial, 'relationship', ''), Validators.maxLength(30)],
      provided_at: [provided_at, [DateValidator.dateValidator]],
      seq: 0,
      isDateEdit: [false],
      btnName: <any>op.get(testimonial, 'btnName', 'Save')
    });
  }

  toggleDateView(intIndex: any, isDateEdit: any) {
    this.testimonialsF.at(intIndex).patchValue({isDateEdit: !isDateEdit});
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

  resetAllSaveBtnName(name: any = 'Save') {
    for (let i = this.testimonialsF.length - 1; i >= 0; i--) {
      this.testimonialsF.at(i).patchValue({btnName: name});
    }
  }

  async addTestimonial() {
    this.testimonialsF.push(this.createTestimonialFormData());
    const data = this.testimonialForm.getRawValue();
    this.isAddMore = true;
    this.resetAllSaveBtnName('');
    await Promise.all(
      op.get(data, 'testimonials', [])
        .map(async (o) => {
          o.provided_at = o.provided_at ? moment(o.provided_at, DATE_FORMAT).valueOf() : '';
          if (o._id) {
            return await this.businessService.updateTestimonials(op.get(this.business, '_id'), o);
          } else {
            delete o._id;
            return await this.businessService.addTestimonials(op.get(this.business, '_id'), o);
          }
        })
    );
    this.isAddMore = false;
    this.resetAllSaveBtnName();
    this.next.emit();
  }

  getProUser() {
    this.store.select('pro')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res.proUser) {
          this.proUser = res.proUser;
          this.business = op.get(res.proUser, 'business');
          this.updateTestimonialForm();
        }
      });
  }

  resetBtnName(intIndex) {
    this.testimonialsF.at(intIndex).patchValue({btnName: 'Save'});
  }

  async saveTestimonial(fg: any, intIndex: any) {
    // stop here if form ctrl is invalid
    if (fg.invalid) {
      return;
    }

    const data = op.get(this.testimonialForm.getRawValue(), 'testimonials', []);
    const payload: any = data[intIndex];
    if (payload) {
      payload.provided_at = moment(payload.provided_at, DATE_FORMAT).valueOf();
      delete payload.isDateEdit;
      delete payload.btnName;
      this.testimonialsF.at(intIndex).patchValue({btnName: 'Saving'});
      fg.markAsPristine();
      if (payload._id) {
        await this.businessService.updateTestimonials(op.get(this.business, '_id'), payload);
      } else {
        delete payload._id;
        await this.businessService.addTestimonials(op.get(this.business, '_id'), payload);
      }
      this.testimonialsF.at(intIndex).patchValue({btnName: 'Saved'});
      this.next.emit();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
