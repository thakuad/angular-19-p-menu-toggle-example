import { Component, type OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDynamicTableComponent } from '../app-dynamic-table/app-dynamic-table.component';
import { ColumnTemplateDirective } from '../app-dynamic-table/column-template.directive';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface TableData {
  id: string;
  name: string;
  email: string;
  project: string;
  status: {
    type: string;
  };
  date: string;
  owner: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
    FormsModule,
  ],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements OnInit {
  @ViewChild('dt') dynamicTable!: AppDynamicTableComponent;
  @ViewChild('selectedValue') userDropdown!: any;
  @ViewChild('status') statusDropdown!: any;

  currentUser: User | null = null;
  selectedUserId = '';

  // Selected values for dropdowns
  selectedUser: any = null;
  selectedStatus: any = null;

  // Available users (for demo)
  users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  ];

  statusSelect: User[] = [
    { id: '1', name: 'Pending', email: 'john@example.com', role: 'Admin' },
    { id: '2', name: 'In Progress', email: 'jane@example.com', role: 'User' },
    { id: '3', name: 'Completed', email: 'bob@example.com', role: 'Editor' },
  ];

  // Table configuration
  columns = [
    { field: 'project', header: 'Project', sortable: true },
    { field: 'status.type', header: 'Status', templateId: 'statusTemplate' },
    { field: 'date', header: 'Due Date' },
    { field: 'owner', header: 'Owner' },
  ];

  // All data (will be filtered by user) - with nested status object
  allData: TableData[] = [
    {
      id: '1',
      name: 'Project A',
      email: 'project-a@example.com',
      project: 'Website Redesign',
      status: { type: 'In Progress' },
      date: '2023-05-15',
      owner: 'John Doe',
    },
    {
      id: '2',
      name: 'Project B',
      email: 'project-b@example.com',
      project: 'Mobile App Development',
      status: { type: 'Pending' },
      date: '2023-06-20',
      owner: 'Jane Smith',
    },
    {
      id: '3',
      name: 'Project C',
      email: 'project-c@example.com',
      project: 'Database Migration',
      status: { type: 'Completed' },
      date: '2023-04-10',
      owner: 'Bob Johnson',
    },
    {
      id: '4',
      name: 'Project D',
      email: 'project-d@example.com',
      project: 'API Integration',
      status: { type: 'Pending' },
      date: '2023-05-30',
      owner: 'John Doe',
    },
    {
      id: '5',
      name: 'Project E',
      email: 'project-e@example.com',
      project: 'Security Audit',
      status: { type: 'Pending' },
      date: '2023-06-05',
      owner: 'John Doe',
    },
    {
      id: '6',
      name: 'Project F',
      email: 'project-f@example.com',
      project: 'Performance Optimization',
      status: { type: 'Completed' },
      date: '2023-04-25',
      owner: 'Bob Johnson',
    },
    {
      id: '7',
      name: 'Project G',
      email: 'project-g@example.com',
      project: 'Content Management',
      status: { type: 'In Progress' },
      date: '2023-05-18',
      owner: 'John Doe',
    },
    {
      id: '8',
      name: 'Project H',
      email: 'project-h@example.com',
      project: 'User Testing',
      status: { type: 'Pending' },
      date: '2023-06-15',
      owner: 'Jane Smith',
    },
    {
      id: '9',
      name: 'Project I',
      email: 'project-i@example.com',
      project: 'Deployment',
      status: { type: 'Completed' },
      date: '2023-04-15',
      owner: 'Bob Johnson',
    },
    {
      id: '10',
      name: 'Project J',
      email: 'project-j@example.com',
      project: 'Documentation',
      status: { type: 'In Progress' },
      date: '2023-05-25',
      owner: 'John Doe',
    },
    {
      id: '11',
      name: 'Project K',
      email: 'project-k@example.com',
      project: 'Training',
      status: { type: 'Pending' },
      date: '2023-06-10',
      owner: 'Jane Smith',
    },
    {
      id: '12',
      name: 'Project L',
      email: 'project-l@example.com',
      project: 'Maintenance',
      status: { type: 'Completed' },
      date: '2023-04-20',
      owner: 'Bob Johnson',
    },
  ];

  constructor() {}

  ngOnInit() {}

  // Method to apply user filter
  applyUserFilter(user: any) {
    this.selectedUser = user;
    if (this.dynamicTable && user) {
      this.dynamicTable.applyFilter(user.name, 'owner');
    }
  }

  // Method to apply status filter
  applyStatusFilter(status: any) {
    this.selectedStatus = status;
    if (this.dynamicTable && status) {
      this.dynamicTable.applyFilter(status.name, 'status.type');
    }
  }

  // Reset all filters and dropdown selections
  resetFilters() {
    // Reset the table filters
    if (this.dynamicTable) {
      this.dynamicTable.clearTable();
      this.selectedStatus = 'John Deo'; // this need to be checked?
      this.applyUserFilter({ name: 'John Doe' });
    }

    // Reset the dropdown selections using two-way binding
    this.selectedUser = null;
    this.selectedStatus = null;
  }
}
