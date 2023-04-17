import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { AddCommentDialogComponent } from './components/add-comment-dialog/add-comment-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input'; 
@NgModule({
  declarations: [ToolbarComponent, AddCommentDialogComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,

    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
