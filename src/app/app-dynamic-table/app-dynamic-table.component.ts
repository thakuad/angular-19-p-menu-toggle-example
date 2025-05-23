import {
  Component,
  ViewChild,
  Input,
  ContentChildren,
  type QueryList,
  type OnInit,
  type AfterViewInit,
  ContentChild,
  type TemplateRef,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import { type Table, TableModule } from 'primeng/table';
import { FilterService } from 'primeng/api';
import { ColumnTemplateDirective } from './column-template.directive';
import { InputText } from 'primeng/inputtext';
import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { ButtonModule } from 'primeng/button';

interface FilterCriteria {
  field: string;
  value: string;
}

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
  @Input() globalFilter: string | string[] = []; // Accepts string or array
  @Input() initialFilterValue = '';

  filteredData: any[] = [];
  filterValue = '';

  // Store multiple filter criteria
  activeFilters: Map<string, string> = new Map();

  constructor(private filterService: FilterService) {
    this.filterService.filters['customFilter'] = (
      value: string,
      filter: string,
    ): boolean => {
      return value.includes(filter);
    };
  }

  ngOnInit() {
    // Set the filter value from the input
    if (this.initialFilterValue) {
      this.filterValue = this.initialFilterValue;
      this.activeFilters.set('global', this.initialFilterValue);
    }
  }

  ngAfterViewInit() {
    // Ensure that @ViewChild 'dt' (the table) is correctly initialized
    if (this.table) {
      console.log('Table initialized:', this.table);

      setTimeout(() => {
        if (this.initialFilterValue) {
          this.applyGlobalFilter(this.initialFilterValue);
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if initialFilterValue has changed
    if (
      changes['initialFilterValue'] &&
      !changes['initialFilterValue'].firstChange
    ) {
      const newValue = changes['initialFilterValue'].currentValue;
      if (newValue !== undefined && this.table) {
        this.applyGlobalFilter(newValue);
      }
    }

    // If data changes, reapply all active filters
    if (changes['data'] && !changes['data'].firstChange) {
      setTimeout(() => {
        this.applyAllFilters();
      });
    }
  }

  // Apply field-specific filter
  applyFieldFilter(field: string, value: string): void {
    console.log(`Applying field filter: ${field} = ${value}`);
    if (!this.table) return;

    if (value && value.trim() !== '') {
      // Store the filter
      this.activeFilters.set(field, value.toLowerCase());
    } else {
      // Remove the filter if value is empty
      this.activeFilters.delete(field);
    }

    // Apply all active filters
    this.applyAllFilters();
  }

  // Apply global filter using PrimeNG FilterService
  applyGlobalFilter = (value: string): void => {
    console.log('Applying global filter:', value);
    if (!this.table) return;

    // Store the global filter value
    this.filterValue = value;

    if (value && value.trim() !== '') {
      this.activeFilters.set('global', value.toLowerCase());
    } else {
      this.activeFilters.delete('global');
    }

    // Apply all active filters
    this.applyAllFilters();
  };

  // Apply all active filters
  applyAllFilters(): void {
    if (!this.table) return;

    // If no active filters, show all data
    if (this.activeFilters.size === 0) {
      this.table.value = this.data;
      return;
    }

    // Start with all data
    let result = [...this.data];

    // Apply each filter in sequence
    this.activeFilters.forEach((filterValue, field) => {
      if (field === 'global') {
        // Global filter searches across all fields
        result = result.filter((item) =>
          this.flattenObject(item).some((flatField) =>
            this.filterService.filters['customFilter'](flatField, filterValue),
          ),
        );
      } else {
        // Field-specific filter
        result = result.filter((item) => {
          const fieldValue = this.getNestedValue(item, field);

          // Handle null or undefined values
          if (fieldValue === null || fieldValue === undefined) {
            return false;
          }

          // Handle objects and primitive values differently
          if (typeof fieldValue === 'object') {
            // For objects, convert to string and check
            return JSON.stringify(fieldValue)
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          } else {
            // For primitive values, convert to string and check
            return fieldValue
              .toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
        });
      }
    });

    this.filteredData = result;
    this.table.value = this.filteredData;

    // Reset to first page when filters change
    if (this.table.first !== 0) {
      this.table.first = 0;
    }
  }

  flattenObject(obj: any, prefix = ''): string[] {
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

  // Get custom template for a column
  getColumnTemplate(templateId: string): any {
    if (!templateId) return null;
    const templateDir = this.columnTemplates?.find(
      (dir) => dir.templateId === templateId,
    );
    return templateDir ? templateDir.template : null;
  }

  // Enhanced getNestedValue to handle nested paths safely
  getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return null;

    try {
      return path.split('.').reduce((acc, key) => {
        // Handle case where acc is null or undefined
        if (acc === null || acc === undefined) return null;
        return acc[key];
      }, obj);
    } catch (error) {
      console.error(`Error accessing path ${path} in object:`, obj, error);
      return null;
    }
  }

  // This is the method that will be exposed to the template
  // Make sure it's a property, not a method, to ensure proper binding
  applyFilter = (value: string, field: string): void => {
    if (!this.table) return;
    console.log('Applying filter:', value, 'to field:', field);

    if (field) {
      // Field-specific filter
      this.applyFieldFilter(field, value);
    } else {
      // Global filter
      this.applyGlobalFilter(value);
    }
  };

  clearTable = (): void => {
    console.log('Clearing table filters');
    this.filterValue = '';
    this.activeFilters.clear();
    this.table.reset();
    this.table.clearFilterValues();
    this.table.first = 0; // Reset to first page
    this.table.value = this.data; // Reset to original data
  };
}
