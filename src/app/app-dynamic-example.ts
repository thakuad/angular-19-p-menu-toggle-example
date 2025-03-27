import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
})
export class ParentComponent {
  data = [
    { id: 1, name: 'John Doe', role: 'Admin', age: 30 },
    { id: 2, name: 'Jane Smith', role: 'User', age: 25 }
  ];

  columns = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'role', header: 'Role' },
    { field: 'age', header: 'Age', sortable: true }
  ];

  exportData() {
    console.log('Export logic here');
  }
}

<app-dynamic-table [data]="data" [columns]="columns">
  <!-- Custom Global Filter -->
  <ng-template #globalFilterTemplate let-applyGlobalFilter let-dt="dt">
    <p-dropdown 
      [options]="[{ label: 'Admin', value: 'Admin' }, { label: 'User', value: 'User' }]"
      placeholder="Filter by Role"
      (onChange)="applyGlobalFilter($event.value)">
    </p-dropdown>

    <!-- Clear Filters Button -->
    <button pButton label="Clear Filters" (click)="dt.clear()"></button>
  </ng-template>

  <!-- Custom Export Button -->
  <ng-template #exportButtonTemplate>
    <button pButton label="Export" (click)="exportData()"></button>
  </ng-template>
</app-dynamic-table>
