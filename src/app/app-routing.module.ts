import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartsEditorComponent } from './parts-editor/components/parts-editor/parts-editor.component';
import { PageNotFoundComponent } from './shared/components';
import { EditorWorkspaceComponent } from './parts-editor/components/editor-workspace/editor-workspace.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: EditorWorkspaceComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
