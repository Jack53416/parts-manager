import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridModule } from '../grid/grid.module';
import { SharedModule } from '../shared/shared.module';
import { PartsEditorComponent } from './components/parts-editor/parts-editor.component';
import { EditorWorkspaceComponent } from './components/editor-workspace/editor-workspace.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { DialogDatabaseComponent } from './components/dialog-database/dialog-database.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PartsEditorComponent, EditorWorkspaceComponent, DialogDatabaseComponent],
  imports: [
    CommonModule,
    SharedModule,
    GridModule,
    CdkTableModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    ScrollingModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
})
export class PartsEditorModule {}
