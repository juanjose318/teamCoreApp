import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAllyFormComponent } from './modal-ally-form.component';

describe('ModalAllyFormComponent', () => {
  let component: ModalAllyFormComponent;
  let fixture: ComponentFixture<ModalAllyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAllyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAllyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
