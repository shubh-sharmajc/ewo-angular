import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProReviewsService} from '../../../_services/pro-reviews/pro-reviews.service';

@Component({
  selector: 'app-flag-review',
  templateUrl: './flag-review.component.html',
  styleUrls: ['./flag-review.component.scss']
})
export class FlagReviewComponent implements OnInit {
  public title: string;
  public reviewID: string;
  public commentID: string;
  public flagForm: FormGroup;
  data: any[] = [];

  constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder, private proReviewsService: ProReviewsService) {

  }

  ngOnInit() {
    this.createFlagForm();
  }

  createFlagForm() {
    this.flagForm = this.formBuilder.group({
      flag_rsn: ['', []],
      flag_note: ['', []],
    });
  }

  get f() {
    return this.flagForm.controls;
  }

  async onFlagSubmit() {
    const data = this.flagForm.getRawValue();
    data.flag_rsn = data.flag_rsn ? data.flag_rsn : 'Spam';
    data.is_flagged = true;
    if (this.commentID) {
      await this.proReviewsService.flagComment(this.reviewID, this.commentID, data);
    } else {
      await this.proReviewsService.flagReview(this.reviewID, data);
    }
  }
}
