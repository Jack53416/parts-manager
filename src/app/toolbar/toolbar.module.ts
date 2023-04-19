import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { DialogDateComponent } from './components/dialog-date/dialog-date.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  MAT_DATE_LOCALE,} from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
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
    MatSnackBarModule
  ],
  exports: [ToolbarComponent],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: DATE_FORMAT},
  ],
})
export class ToolbarModule {}
