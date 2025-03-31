import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDynamicTableComponent } from '../app-dynamic-table/app-dynamic-table.component';
import { ColumnTemplateDirective } from '../app-dynamic-table/column-template.directive';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
  address: {
    city: string;
    street: string;
  }[];
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    AppDynamicTableComponent,
    TagModule,
    ButtonModule,
    ColumnTemplateDirective,
    SelectModule,
  ],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements OnInit {
  users: User[] = [];
  columns: any[] = [];
  defaultFilter = '';
  tableStatus = [
    {
      name: 'Pending',
      code: 'pending',
    },
    { name: 'Active', code: 'active' },
    { name: 'In active', code: 'inactive' },
  ];

  ngOnInit() {
    this.defaultFilter = 'active';
    // Sample data
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 32,
        status: 'active',
        lastLogin: new Date('2023-10-15T14:30:00'),
        address: [
          { city: 'New York', street: 'Broadway' },
          { city: 'Los Vegas ', street: 'Broadway' },
        ],
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 28,
        status: 'inactive',
        lastLogin: new Date('2023-09-22T09:15:00'),
        address: [{ city: 'Boston', street: 'Main St' }],
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        age: 45,
        status: 'pending',
        lastLogin: new Date('2023-10-18T11:45:00'),
        address: [{ city: 'Chicago', street: 'Lake Ave' }],
      },
    ];

    // Column definitions
    this.columns = [
      { field: 'id', header: 'ID', width: '80px' },
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      {
        field: 'age',
        header: 'Age',
        templateId: 'ageTemplate',
      },
      {
        field: 'status',
        header: 'Status',
        templateId: 'statusTemplate',
      },
      {
        field: 'lastLogin',
        header: 'Last Login',
        templateId: 'dateTemplate',
      },
      { field: 'address', header: 'City', templateId: 'cityTemplate' },
      {
        field: 'action',
        header: 'Action',
        templateId: 'actionTemplate',
      },
    ];
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  }
}
