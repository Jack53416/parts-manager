import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartsDataService } from '../../../parts-editor/services/parts-data.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCommentDialogComponent } from '../add-comment-dialog/add-comment-dialog.component';
import { Subject, filter, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  constructor(
    private snackbar: MatSnackBar,
    private partsDataService: PartsDataService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async readExcel() {
    await this.partsDataService.openEditor();
  }

  addComment() {
    const dialogRef = this.matDialog.open(AddCommentDialogComponent, {
      data: 'This is initial comment, passed from ToolbarComponent',
    });
    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter((result) => result)
      )
      .subscribe((result) => this.snackbar.open(result));
  }
}
