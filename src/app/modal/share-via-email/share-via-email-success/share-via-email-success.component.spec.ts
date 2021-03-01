import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShareViaEmailSuccessComponent} from './share-via-email-success.component';

describe('ShareViaEmailSuccessComponent', () => {
  let component: ShareViaEmailSuccessComponent;
  let fixture: ComponentFixture<ShareViaEmailSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareViaEmailSuccessComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareViaEmailSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
