import {
  Component,
  Input,
  ViewChild,
  ContentChildren,
  QueryList,
  inject,
} from '@angular/core';
import { CommonModule, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { FilterService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { ColumnTemplateDirective } from '../app-dynamic-table/column-template.directive';

export interface TableColumn {
  field: string; // supports "name" | "tags[].label"
  header: string;
  sortable?: boolean;
}

@Component({
  selector: 'table-test',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputText,
    NgForOf,
    NgIf,
    NgTemplateOutlet,
  ],
  templateUrl: './table-test.component.html',
  styleUrl: './table-test.component.css',
})
export class AppDynamicTableComponent<T extends object> {
  @ViewChild('dt') table!: Table;

  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() globalFilterFields: string[] = [];

  @ContentChildren(ColumnTemplateDirective)
  columnTemplates!: QueryList<ColumnTemplateDirective>;

  private filterService = inject(FilterService);

  constructor() {
    // Register once in constructor
    if (!(this.filterService as any).constraints['nestedArrayContains']) {
      this.filterService.register(
        'nestedArrayContains',
        (value: unknown, filter: unknown): boolean => {
          if (!filter || filter.toString().trim() === '') return true;
          if (value == null) return false;

          const f = filter.toString().toLowerCase();

          if (Array.isArray(value)) {
            return value.some((v) =>
              typeof v === 'object'
                ? JSON.stringify(v).toLowerCase().includes(f)
                : String(v).toLowerCase().includes(f),
            );
          }

          return String(value).toLowerCase().includes(f);
        },
      );
    }
  }

  getColumnTemplate(templateId: string) {
    return (
      this.columnTemplates?.find((dir) => dir.templateId === templateId)
        ?.template ?? null
    );
  }

  clearTable(): void {
    this.table.clear();
  }
}
