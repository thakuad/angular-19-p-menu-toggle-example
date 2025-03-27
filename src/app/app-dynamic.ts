import { Component, Input, ContentChild, TemplateRef, OnInit } from '@angular/core';
import { FilterService } from 'primeng/api';
import { Table } from 'primeng/table';

export interface ColumnConfig {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  template?: TemplateRef<any>;
}

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './app-dynamic-table.component.html',
  standalone: true,
  imports: [Table],
  providers: [FilterService],
})
export class AppDynamicTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] = [];
  @Input() expandable: boolean = false;
  
  // Optional Templates
  @ContentChild('globalFilterTemplate') globalFilterTemplate!: TemplateRef<any>;
  @ContentChild('exportButtonTemplate') exportButtonTemplate!: TemplateRef<any>;

  constructor(public filterService: FilterService) {}

  ngOnInit() {
    // Can be used to initialize anything if needed
  }

  applyGlobalFilter(filterValue: string, dt: Table) {
    dt.filterGlobal(filterValue, 'contains');
  }
}