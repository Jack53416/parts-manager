import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogDateComponent } from './components/dialog-date/dialog-date.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

const DATE_FORMAT = {
  parse: {
    dateInput: 'DD.MM.YYYY'
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY'
  }
};

@NgModule({
  declarations: [ToolbarComponent, DialogDateComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    BrowserModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  exports: [ToolbarComponent],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {strict: true, useUtc: true}},
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
  ],
})
export class ToolbarModule {}
