import { Component, Input, ContentChild, TemplateRef, ViewChild, Type } from '@angular/core';
import { Table } from 'primeng/table';
import { FilterService } from 'primeng/api';

export interface ColumnConfig<T> {
  field: Extract<keyof T | string, string>;  // Ensures only valid field names
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  template?: TemplateRef<{ $implicit: T }>;
}

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './app-dynamic-table.component.html',
  standalone: true,
  providers: [FilterService],
})
export class AppDynamicTableComponent<T extends object> {  
  @Input() data: T[] = []; // Now fully type-safe
  @Input() columns: ColumnConfig<T>[] = [];
  @Input() expandable: boolean = false;

  @ViewChild('dt') table!: Table;

  // Custom Templates
  @ContentChild('globalFilterTemplate') globalFilterTemplate!: TemplateRef<any>;
  @ContentChild('exportButtonTemplate') exportButtonTemplate!: TemplateRef<any>;

  constructor(public filterService: FilterService) {}

getNestedValue<T extends object, K extends keyof any>(obj: T, path: K): unknown {
  return path.toString().split('.').reduce((acc: any, part) => acc && acc[part], obj);
}


  applyGlobalFilter(filterValue: string) {
    if (this.table) {
      this.table.filterGlobal(filterValue, 'contains');
    }
  }
}