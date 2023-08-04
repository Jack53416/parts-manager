import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmSummaryDateComponent } from './dialog-confirm-summary-date.component';

describe('DialogConfirmSummaryDateComponent', () => {
  let component: DialogConfirmSummaryDateComponent;
  let fixture: ComponentFixture<DialogConfirmSummaryDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmSummaryDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmSummaryDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
