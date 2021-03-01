import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProCategoriesComponent } from './pro-categories.component';

describe('ProCategoriesComponent', () => {
  let component: ProCategoriesComponent;
  let fixture: ComponentFixture<ProCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
