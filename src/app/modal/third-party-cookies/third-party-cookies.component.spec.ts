import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ThirdPartyCookiesComponent} from './third-party-cookies.component';

describe('ThirdPartyCookiesComponent', () => {
  let component: ThirdPartyCookiesComponent;
  let fixture: ComponentFixture<ThirdPartyCookiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThirdPartyCookiesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
