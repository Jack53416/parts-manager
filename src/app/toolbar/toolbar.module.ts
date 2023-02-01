import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatRippleModule],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
