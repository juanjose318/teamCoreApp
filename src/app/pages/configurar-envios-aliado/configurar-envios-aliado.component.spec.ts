import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarEnviosAliadoComponent } from './configurar-envios-aliado.component';

describe('ConfigurarEnviosAliadoComponent', () => {
  let component: ConfigurarEnviosAliadoComponent;
  let fixture: ComponentFixture<ConfigurarEnviosAliadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurarEnviosAliadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarEnviosAliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
