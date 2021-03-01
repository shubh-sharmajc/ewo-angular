import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecognitionsComponent} from './recognitions.component';

describe('RecognitionsComponent', () => {
  let component: RecognitionsComponent;
  let fixture: ComponentFixture<RecognitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecognitionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecognitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
