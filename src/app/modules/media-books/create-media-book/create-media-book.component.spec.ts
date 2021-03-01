import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateMediaBookComponent} from './create-media-book.component';

describe('CreateMediaBookComponent', () => {
  let component: CreateMediaBookComponent;
  let fixture: ComponentFixture<CreateMediaBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMediaBookComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMediaBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
