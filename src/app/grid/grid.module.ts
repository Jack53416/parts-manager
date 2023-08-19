import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridCellValueComponent } from './components/grid-cell-value/grid-cell-value.component';
import { OverlayInputComponent } from './components/overlay-input/overlay-input.component';
import { GridCellDirective } from './directives/grid-cell.directive';
import { GridDirective } from './directives/grid.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    GridCellDirective,
    OverlayInputComponent,
    GridCellValueComponent,
    GridDirective,
  ],
  imports: [
    CommonModule,
    CdkTableModule,
    OverlayModule,
    TextFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  exports: [GridCellValueComponent, GridCellDirective, GridDirective],
})
export class GridModule {}
