import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCreateAllyComponent } from './search-create-ally.component';

describe('SearchCreateAllyComponent', () => {
  let component: SearchCreateAllyComponent;
  let fixture: ComponentFixture<SearchCreateAllyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCreateAllyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCreateAllyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
