import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchCompanyComponent } from './serch-company.component';

describe('SerchCompanyComponent', () => {
  let component: SerchCompanyComponent;
  let fixture: ComponentFixture<SerchCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerchCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerchCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
