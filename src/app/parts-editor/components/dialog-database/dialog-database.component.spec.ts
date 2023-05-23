import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDatabaseComponent } from './dialog-database.component';

describe('DialogDatabaseComponent', () => {
  let component: DialogDatabaseComponent;
  let fixture: ComponentFixture<DialogDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDatabaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
