import { Injectable } from '@angular/core';
import { Part, MOCK_PRODUCTION_REPORT } from '../models/part';
import { ElectronService } from '../../core/services/electron/electron.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PART_FAILURES, PartFailure } from '../models/part-failure';
import { PartEditor, PartWorkbook } from '../models/editor';
import { Cell } from '../models/cell';

export interface EditorsUiState {
  activeIndex: number | null;
  openedEditors: PartEditor[];
}

@Injectable({
  providedIn: 'root',
})
export class PartsDataService {
  private uiState: EditorsUiState = {
    openedEditors: [],
    activeIndex: null,
  };

  private uiStateSubject$ = new BehaviorSubject(this.uiState);

  constructor(private electronService: ElectronService) {}

  get uiState$(): Observable<EditorsUiState> {
    return this.uiStateSubject$.asObservable();
  }

  get activeEditor(): PartEditor | null {
    if (
      this.uiState.activeIndex === null ||
      this.uiState.activeIndex === undefined
    ) {
      return null;
    }
    return this.uiState.openedEditors[this.uiState.activeIndex];
  }

  setActiveIdx(index: number) {
    if (index === this.uiState.activeIndex) {
      return;
    }

    this.updateUiState({ activeIndex: index });
  }

  async openEditor(date: Date) {
    const reportParts = await this.getFailureReport(date);
    const editors = this.uiState.openedEditors;

    const editorCount = editors.push(
      new PartEditor(
        this.convertReportToWorkbook(reportParts),
        date
      )
    );

    this.updateUiState({
      activeIndex: editorCount - 1,
      openedEditors: editors,
    });
  }

  closeEditor(editor: PartEditor) {
    const editors = this.uiState.openedEditors;
    const editorIdx = editors.findIndex((arrEditor) => arrEditor === editor);

    if (editorIdx === -1) {
      return;
    }

    editors.splice(editorIdx, 1);

    let activeEditorIndex = this.uiState.activeIndex;

    if (activeEditorIndex >= editors.length) {
      activeEditorIndex =
        editors.length === 0
          ? null
          : (this.uiState.activeIndex - 1) % editors.length;
    }

    this.updateUiState({
      openedEditors: editors,
      activeIndex: activeEditorIndex,
    });
  }

  async saveEditor(parts: PartWorkbook, dateReport: Date): Promise<void> {
    await this.electronService.savePartsToStatistic(parts, dateReport);
  }

  private updateUiState(newState: Partial<EditorsUiState>) {
    this.uiState = Object.freeze({ ...this.uiState, ...newState });
    this.uiStateSubject$.next(this.uiState);
  }

  private convertReportToWorkbook(parts: Partial<PartFailure>[] | Map<string, Part>): PartWorkbook {
    const sortedParts = Array.from(parts.values()).sort((objectA: Part, objectB: Part) => {
      if (objectA.machine < objectB.machine) { return -1; }
      if (objectA.machine > objectB.machine) { return 1; }
      return 0;
    });

    return Array.from(sortedParts.values()).map((part, rowIdx) =>
      Array.from(PART_FAILURES.keys()).reduce((acc, key) => {
        acc[key] = new Cell({
          column: key,
          row: rowIdx,
          value: String(part[key] ?? ''),
        });
        return acc;
      }, {})
    ) as PartWorkbook;
  }

  private async getFailureReport(date: Date): Promise<Partial<PartFailure>[] | Map<string, Part>> {
    if (this.electronService.isElectron) {
      return await this.electronService.readExcelFile(date);
    }

    return this.getMockedData();
  }

  private getMockedData(): Partial<PartFailure>[] {
    return Array(20)
      .fill(0)
      .map((_, index) => ({
        ...MOCK_PRODUCTION_REPORT[index % MOCK_PRODUCTION_REPORT.length],
      }));
  }
}
