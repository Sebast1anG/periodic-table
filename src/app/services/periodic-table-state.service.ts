import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PeriodicElement } from '../periodic-table/periodic-table.component';
export interface State {
  elements: PeriodicElement[];
  loading: boolean;
  initialLoading: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Injectable({
  providedIn: 'root',
})
export class PeriodicTableStateService extends RxState<State> {
  constructor() {
    super();
    this.set({
      elements: [],
      loading: true,
      initialLoading: true,
    });
    this.loadData();
  }

  private loadData() {
    of(ELEMENT_DATA)
      .pipe(delay(2000))
      .subscribe((data) => {
        this.set({
          elements: data,
          loading: false,
          initialLoading: false,
        });

        this.filterElements('');
      });
  }

  updateElement(updatedElement: PeriodicElement) {
    this.set((state) => ({
      elements: state.elements.map((el) =>
        el.position === updatedElement.position ? { ...updatedElement } : el
      ),
    }));
  }

  filterElements(filterValue: string) {
    const filtered = filterValue
      ? ELEMENT_DATA.filter((el) =>
          el.name.toLowerCase().includes(filterValue.toLowerCase())
        )
      : ELEMENT_DATA;

    this.set({ elements: filtered });
  }
}
