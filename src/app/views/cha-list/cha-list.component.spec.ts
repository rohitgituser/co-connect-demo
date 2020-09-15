import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaListComponent } from './cha-list.component';

describe('ChaListComponent', () => {
  let component: ChaListComponent;
  let fixture: ComponentFixture<ChaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
