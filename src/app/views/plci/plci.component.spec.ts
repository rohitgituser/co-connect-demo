import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlciComponent } from './plci.component';

describe('PlciComponent', () => {
  let component: PlciComponent;
  let fixture: ComponentFixture<PlciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
