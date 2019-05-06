import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderratioComponent } from './genderratio.component';

describe('GenderratioComponent', () => {
  let component: GenderratioComponent;
  let fixture: ComponentFixture<GenderratioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenderratioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderratioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
