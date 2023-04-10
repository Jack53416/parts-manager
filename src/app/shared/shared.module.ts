import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { IconButtonDirective } from './directives/button/icon-button.directive';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, IconButtonDirective],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule],
})
export class SharedModule {}
