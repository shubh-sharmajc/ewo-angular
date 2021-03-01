import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProMarketingPagesComponent } from './pro-marketing-pages.component';

describe('ProMarketingPagesComponent', () => {
  let component: ProMarketingPagesComponent;
  let fixture: ComponentFixture<ProMarketingPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProMarketingPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProMarketingPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
