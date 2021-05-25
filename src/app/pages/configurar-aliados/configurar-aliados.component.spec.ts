import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarAliadosComponent } from './configurar-aliados.component';

describe('ConfigurarAliadosComponent', () => {
  let component: ConfigurarAliadosComponent;
  let fixture: ComponentFixture<ConfigurarAliadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurarAliadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarAliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
