import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDirective } from '../../../grid/directives/grid.directive';
import { GridDataSource } from '../../../grid/models/grid-data-source';
import { PartFailure, PART_FAILURES } from '../../models/part-failure';
import { PartsDataService } from '../../services/parts-data.service';

@Component({
  selector: 'app-parts-editor',
  templateUrl: './parts-editor.component.html',
  styleUrls: ['./parts-editor.component.scss'],
})
export class PartsEditorComponent implements OnInit {
  @ViewChild(GridDirective, { static: true }) grid: GridDirective;
  stickyHeaders: Set<string> = new Set(['machine', 'name', 'articleNo', 'tool']);
  partsHeaders: string[] = [...PART_FAILURES];
  displayedColumns: string[] = ['position', ...PART_FAILURES];
  dataSource = new GridDataSource<Partial<PartFailure>>([]);

  constructor(private partsDataService: PartsDataService) {}

  ngOnInit(): void {
    this.dataSource.data.next(this.partsDataService.getFailureReport());
  }
}
