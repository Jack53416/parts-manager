import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDateComponent } from './dialog-date.component';

describe('DialogDateComponent', () => {
  let component: DialogDateComponent;
  let fixture: ComponentFixture<DialogDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
