import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMasterFileComponent } from './upload-master-file.component';

describe('UploadMasterFileComponent', () => {
  let component: UploadMasterFileComponent;
  let fixture: ComponentFixture<UploadMasterFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadMasterFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMasterFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
