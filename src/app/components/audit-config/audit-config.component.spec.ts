import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditConfigComponent } from './audit-config.component';

describe('AuditConfigComponent', () => {
  let component: AuditConfigComponent;
  let fixture: ComponentFixture<AuditConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
