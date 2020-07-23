import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersLoginComponent } from './members-login.component';

describe('MembersLoginComponent', () => {
  let component: MembersLoginComponent;
  let fixture: ComponentFixture<MembersLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
