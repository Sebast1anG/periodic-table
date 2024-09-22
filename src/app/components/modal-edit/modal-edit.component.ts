import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { PeriodicTableStateService } from '../../services/periodic-table-state.service';
import { Observable } from 'rxjs';
import { PeriodicElement } from '../../periodic-table/periodic-table.component';
@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    RxPush,
  ],
})
export class ModalEditComponent implements OnInit {
  loading$!: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<ModalEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
    private stateService: PeriodicTableStateService
  ) {}

  ngOnInit(): void {
    this.loading$ = this.stateService.select('loading');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.stateService.set({ loading: true });

    setTimeout(() => {
      this.stateService.updateElement(this.data);
      this.stateService.set({ loading: false });
      this.dialogRef.close(this.data);
    }, 2000);
  }
}
