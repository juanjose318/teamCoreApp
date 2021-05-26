import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditAllyComponent } from './audit-ally.component';

describe('AuditAllyComponent', () => {
  let component: AuditAllyComponent;
  let fixture: ComponentFixture<AuditAllyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditAllyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditAllyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
