import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '../../../grid/components/grid/grid.component';
import { GridDataSource } from '../../../grid/models/grid-data-source';
import { PeriodicElement } from '../../models/periodic-element';
import { PartsDataService } from '../../services/parts-data.service';

@Component({
  selector: 'app-parts-editor',
  templateUrl: './parts-editor.component.html',
  styleUrls: ['./parts-editor.component.scss'],
})
export class PartsEditorComponent implements OnInit {
  @ViewChild(GridComponent, { static: true }) grid: GridComponent;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new GridDataSource<PeriodicElement>([]);

  constructor(private partsDataService: PartsDataService) {}

  ngOnInit(): void {
    this.dataSource.data.next(this.partsDataService.getParts());
  }
}
