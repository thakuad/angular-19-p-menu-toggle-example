import {
  Component,
  ContentChildren,
  Input,
  type QueryList,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ColumnTemplateDirective } from './column-template.directive';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule],
  templateUrl: './app-dynamic-table.component.html',
  styleUrls: ['./app-dynamic-table.component.css'],
})
export class AppDynamicTableComponent {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() paginator = false;
  @Input() rows = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 25, 50];
  @Input() responsive = true;
  @Input() globalFilterFields: string[] = [];
  @Input() expandable = false;
  @Input() expandedRowKeys: { [key: string]: boolean } = {};
  @Input() dataKey = 'id';
  @Input() expandTemplateId = 'expandTemplate'; // ID for the expand template

  // Query for all column templates passed to this component
  @ContentChildren(ColumnTemplateDirective)
  columnTemplates!: QueryList<ColumnTemplateDirective>;

  // Get the template for a specific column if it exists
  getColumnTemplate(templateId: string): any {
    if (!templateId) return null;

    const templateDir = this.columnTemplates?.find(
      (dir) => dir.templateId === templateId,
    );
    return templateDir ? templateDir.template : null;
  }

  // Check if a column has a custom template
  hasCustomTemplate(column: any): boolean {
    return !!column.templateId && !!this.getColumnTemplate(column.templateId);
  }

  getNestedValue<T extends object, K extends keyof any>(
    obj: T,
    path: K,
  ): unknown {
    return path
      .toString()
      .split('.')
      .reduce((acc: any, part) => acc && acc[part], obj);
  }

  // Method to apply global filter
  applyGlobalFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const table = document.getElementById('dt') as any;
    if (table) {
      table.filterGlobal(filterValue, 'contains');
    }
  }

  // Toggle row expansion
  toggleRow(event: Event, rowData: any): void {
    event.preventDefault();

    if (!this.dataKey) {
      console.error('dataKey is required for expandable rows');
      return;
    }

    const rowKey = rowData[this.dataKey];
    this.expandedRowKeys = {
      ...this.expandedRowKeys,
      [rowKey]: !this.expandedRowKeys[rowKey],
    };
  }

  // Check if row is expanded
  isRowExpanded(rowData: any): boolean {
    if (!this.dataKey) return false;
    const rowKey = rowData[this.dataKey];
    return !!this.expandedRowKeys[rowKey];
  }

  // Get the expand template
  getExpandTemplate(): any {
    return this.getColumnTemplate(this.expandTemplateId);
  }

  // Check if expand template exists
  hasExpandTemplate(): boolean {
    return !!this.getExpandTemplate();
  }
}
