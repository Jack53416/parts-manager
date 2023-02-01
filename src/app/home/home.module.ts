import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { GridModule } from '../grid/grid.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, MatIconModule, GridModule, MatSidenavModule],
})
export class HomeModule {}
