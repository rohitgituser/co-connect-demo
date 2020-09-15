import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteChaComponent } from './invite-cha.component';

describe('InviteChaComponent', () => {
  let component: InviteChaComponent;
  let fixture: ComponentFixture<InviteChaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteChaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteChaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
