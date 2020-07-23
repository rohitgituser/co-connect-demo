import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRejestrationComponent } from './update-rejestration.component';

describe('UpdateRejestrationComponent', () => {
  let component: UpdateRejestrationComponent;
  let fixture: ComponentFixture<UpdateRejestrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRejestrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRejestrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
