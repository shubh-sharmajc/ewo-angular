import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProMarketingSolutionsComponent } from './pro-marketing-solutions.component';

describe('ProMarketingSolutionsComponent', () => {
  let component: ProMarketingSolutionsComponent;
  let fixture: ComponentFixture<ProMarketingSolutionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProMarketingSolutionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProMarketingSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
