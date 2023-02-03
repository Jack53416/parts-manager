import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsEditorComponent } from './parts-editor.component';

describe('PartsEditorComponent', () => {
  let component: PartsEditorComponent;
  let fixture: ComponentFixture<PartsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
