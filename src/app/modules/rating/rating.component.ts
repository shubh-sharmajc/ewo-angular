import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() rate: any;
  @Input() readonly: any;
  @Input() max: any = 5;
  @Input() fontSize: any = `1.5rem`;

  constructor() {
  }

  ngOnInit() {
  }

}
