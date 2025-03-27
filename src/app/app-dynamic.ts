import { Component, Input, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FilterService } from 'primeng/api';

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
  providers: [FilterService],
})
export class AppDynamicTableComponent {
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] = [];
  @Input() expandable: boolean = false;

  @ViewChild('dt') table!: Table;

  // Custom Templates
  @ContentChild('globalFilterTemplate') globalFilterTemplate!: TemplateRef<any>;
  @ContentChild('exportButtonTemplate') exportButtonTemplate!: TemplateRef<any>;

  constructor(public filterService: FilterService) {}

  applyGlobalFilter(filterValue: string) {
    if (this.table) {
      this.table.filterGlobal(filterValue, 'contains');
    }
  }
}