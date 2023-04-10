import { Injectable } from '@angular/core';
import { Part } from '../models/part';
import { ElectronService } from '../../core/services/electron/electron.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MOCK_PRODUCTION_REPORT } from '../models/part';
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
  getDataFromTable = new Subject<string>();
  sendReporttoTable = new Subject<{ [key: string]: Part }>();

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

  async openEditor() {
    // ToDo(Jacek): Name editors better

    const report = await this.getFailureReport();
    const editors = this.uiState.openedEditors;

    const editorCount = editors.push(
      new PartEditor(
        this.convertReportToWorkbook(report),
        `new-workbook(${editors.length})`
      )
    );

    this.updateUiState({
      activeIndex: editorCount - 1,
      openedEditors: editors,
    });

    // this.eventSendReportDataToTable(report);
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

  eventGetDataFromTable(msg: string) {
    this.getDataFromTable.next(msg);
  }

  eventSendReportDataToTable(report: { [key: string]: Part }) {
    this.sendReporttoTable.next(report);
  }

  private updateUiState(newState: Partial<EditorsUiState>) {
    this.uiState = Object.freeze({ ...this.uiState, ...newState });
    this.uiStateSubject$.next(this.uiState);
  }

  private convertReportToWorkbook(parts: Partial<PartFailure>[]): PartWorkbook {
    return parts.map((part, rowIdx) =>
      PART_FAILURES.reduce((acc, key) => {
        acc[key] = new Cell({
          column: key,
          row: rowIdx,
          value: String(part[key] ?? ''),
        });
        return acc;
      }, {})
    ) as PartWorkbook;
  }

  private async getFailureReport(): Promise<Partial<PartFailure>[]> {
    if (this.electronService.isElectron) {
      return await this.electronService.readExcelFile();
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
