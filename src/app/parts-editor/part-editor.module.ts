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

@NgModule({
  declarations: [PartsEditorComponent, EditorWorkspaceComponent],
  imports: [
    CommonModule,
    SharedModule,
    GridModule,
    CdkTableModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    ScrollingModule
  ],
})
export class PartsEditorModule {}
