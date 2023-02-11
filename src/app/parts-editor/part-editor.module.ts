import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridModule } from '../grid/grid.module';
import { SharedModule } from '../shared/shared.module';
import { PartsEditorComponent } from './components/parts-editor/parts-editor.component';

@NgModule({
  declarations: [PartsEditorComponent],
  imports: [CommonModule, SharedModule, GridModule, CdkTableModule],
})
export class PartsEditorModule {}
