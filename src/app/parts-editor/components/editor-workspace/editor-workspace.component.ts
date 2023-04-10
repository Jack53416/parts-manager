import { Component, OnInit } from '@angular/core';
import { PartEditor } from '../../models/editor';
import { PartsDataService } from '../../services/parts-data.service';

@Component({
  selector: 'app-editor-workspace',
  templateUrl: './editor-workspace.component.html',
  styleUrls: ['./editor-workspace.component.scss'],
})
export class EditorWorkspaceComponent implements OnInit {
  readonly editorsUiState$ = this.partsDataService.uiState$;

  constructor(private partsDataService: PartsDataService) {}

  ngOnInit(): void {}

  closeEditor(editor: PartEditor) {
    this.partsDataService.closeEditor(editor);
  }

  tabChange(index: number) {
    this.partsDataService.setActiveIdx(index);
  }
}
