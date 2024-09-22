import {
  Component,
  OnInit,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, fromEvent } from 'rxjs';
import { PeriodicTableStateService } from '../../services/periodic-table-state.service';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ModalEditComponent } from '../modal-edit/modal-edit.component';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
})
export class PeriodicTableComponent implements OnInit, AfterViewChecked {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'edit'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  elements$!: Observable<PeriodicElement[]>;
  initialLoading$!: Observable<boolean>;
  saving$!: Observable<boolean>;
  loading$!: Observable<boolean>;

  @ViewChildren('filterInput') filterInputs!: QueryList<ElementRef>;

  constructor(
    public dialog: MatDialog,
    private stateService: PeriodicTableStateService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.elements$ = this.stateService.select('elements');
    this.loading$ = this.stateService.select('loading');
    this.initialLoading$ = this.stateService.select('initialLoading');

    this.stateService.select('elements').subscribe((elements) => {
      this.dataSource.data = elements || [];
    });
  }

  ngAfterViewChecked(): void {
    this.initialLoading$.subscribe((isLoading) => {
      if (!isLoading && this.filterInputs && this.filterInputs.first) {
        const filterInput = this.filterInputs.first.nativeElement;

        fromEvent(filterInput, 'keyup')
          .pipe(
            debounceTime(2000),
            map((event: any) => event.target.value),
            distinctUntilChanged()
          )
          .subscribe((filterValue: string) => {
            this.stateService.filterElements(filterValue);
          });

        this.cdRef.detectChanges();
      }
    });
  }

  openEditDialog(element: PeriodicElement): void {
    this.dialog
      .open(ModalEditComponent, {
        width: '400px',
        data: { ...element },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.stateService.updateElement(result);
        }
      });
  }
}
