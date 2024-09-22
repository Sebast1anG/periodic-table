import { Component } from '@angular/core';
import { PeriodicTableComponent } from './periodic-table/periodic-table.component';
@Component({
  selector: 'app-root',
  template: '<app-periodic-table></app-periodic-table>',
  standalone: true,
  imports: [PeriodicTableComponent],
})
export class AppComponent {}
