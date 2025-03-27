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