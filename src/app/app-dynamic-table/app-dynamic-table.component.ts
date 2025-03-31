import {
  Component,
  ViewChild,
  Input,
  ContentChildren,
  QueryList,
  OnInit,
  AfterViewInit,
  ContentChild,
  TemplateRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FilterService } from 'primeng/api';
import { ColumnTemplateDirective } from './column-template.directive';
import { InputText } from 'primeng/inputtext';
import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './app-dynamic-table.component.html',
  styleUrls: ['./app-dynamic-table.component.css'],
  standalone: true,
  providers: [FilterService],
  imports: [
    TableModule,
    InputText,
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    ButtonModule,
  ],
  // Inject PrimeNG FilterService
})
export class AppDynamicTableComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @ViewChild('dt') table!: Table;

  @ContentChildren(ColumnTemplateDirective)
  columnTemplates!: QueryList<ColumnTemplateDirective>;

  @ContentChild('globalFilterTemplate') globalFilterTemplate!: TemplateRef<any>;

  @Input() columns: any[] = [];
  @Input() data: any[] = [];

  @Input() filterValue: string[] = [];

  // filters: any = {};
  filteredData: any[] = [];

  constructor(private filterService: FilterService) {
    this.filterService.filters['customFilter'] = (
      value: string,
      filter: string,
    ): boolean => {
      return value.includes(filter);
    };
  }

  // getGlobalFilterFields(): string[] {
  //   return this.columns.map((col) => col.field);
  // }

  ngOnInit() {}

  ngAfterViewInit() {
    // Ensure that @ViewChild 'dt' (the table) is correctly initialized
    if (this.table) {
      console.log('Table initialized:', this.table);
      this.applyFilter(this.filterValue);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if initialFilterValue has changed
    if (changes['filterValue']) {
      // this.applyFilter(this.initialFilterValue);
    }
  }

  // 🔥 Apply global filter using PrimeNG FilterService
  applyGlobalFilter = (value: string): void => {
    console.log('Filtered Value', value);
    if (!this.table) return;

    // if (value.trim() && this.initialFilterValue.trim() === '') {
    //   console.log(this.initialFilterValue);
    //   this.table.value = this.data;
    // }

    // Use the FilterService to filter on flattened data
    const filterValue = value.toLowerCase();
    this.filteredData = this.data.filter((item) =>
      this.flattenObject(item).some((field) =>
        this.filterService.filters['customFilter'](field, filterValue),
      ),
    );
    this.table.value = this.filteredData;
  };

  flattenObject(obj: any, prefix: string = ''): string[] {
    const flattened: string[] = [];

    // Check if the value is an array or object
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        flattened.push(...this.flattenObject(item, `${prefix}[${index}]`)); // Handle array elements
      });
    } else if (typeof obj === 'object' && obj !== null) {
      // Object: Recurse into object keys
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const propName = prefix ? `${prefix}.${key}` : key;
        flattened.push(...this.flattenObject(value, propName)); // Recursively flatten object properties
      });
    } else {
      // Base case: It's a primitive value, convert to string and lowercase
      flattened.push(obj ? obj.toString().toLowerCase() : ''); // Convert to string and to lower case
    }

    return flattened;
  }

  // 🔥 Get custom template for a column
  getColumnTemplate(templateId: string): any {
    if (!templateId) return null;
    const templateDir = this.columnTemplates?.find(
      (dir) => dir.templateId === templateId,
    );
    return templateDir ? templateDir.template : null;
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  }

  applyFilter = (value: string[]) => {
    if (!this.table) return;
    console.log('i am in apply filter');
    this.applyGlobalFilter(value[0]);
  };

  clearTable = (value: string) => {
    console.log('Testing');
    this.table.reset();
    this.table.clearFilterValues();
    this.table.first = 0; // Reset to first page
    this.filterService.filters['customFilter'] = (
      value: string,
      filter: string,
    ): boolean => {
      return true; // No filtering will happen, effectively resetting the filter
    };
  };
}
