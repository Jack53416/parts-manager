import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { CustomToolbarComponent } from './components/custom-toolbar/custom-toolbar.component';

@NgModule({
  declarations: [ToolbarComponent, CustomToolbarComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatRippleModule],
  exports: [ToolbarComponent, CustomToolbarComponent],
})
export class ToolbarModule {}
