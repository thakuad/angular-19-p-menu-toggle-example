import { Component, Input } from '@angular/core';
import _ from 'lodash';

@Component({
  selector: 'app-compare-list',
  templateUrl: './compare-list.component.html',
  styleUrls: ['./compare-list.component.css']
})
export class CompareListComponent {
  @Input() primaryData: any[] = [];
  @Input() selectedData: any[] = [];

  leftSearch = '';
  rightSearch = '';

  leftSelected: any[] = [];
  rightSelected: any[] = [];

  allLeftSelected = false;
  allRightSelected = false;

  // Filtered and sorted primary (left side)
  get sortedFilteredPrimary() {
    const unselected = _.differenceBy(this.primaryData, this.selectedData, 'id');
    const filtered = _.filter(unselected, item =>
      item.name.toLowerCase().includes(this.leftSearch.toLowerCase())
    );
    return _.orderBy(filtered, ['name'], ['asc']);
  }

  // Filtered and sorted selected (right side)
  get sortedFilteredSelected() {
    const filtered = _.filter(this.selectedData, item =>
      item.name.toLowerCase().includes(this.rightSearch.toLowerCase())
    );
    return _.orderBy(filtered, ['name'], ['asc']);
  }

  // Toggle all checkboxes
  toggleSelectAll(side: 'left' | 'right') {
    if (side === 'left') {
      this.leftSelected = this.allLeftSelected ? _.clone(this.sortedFilteredPrimary) : [];
    } else {
      this.rightSelected = this.allRightSelected ? _.clone(this.sortedFilteredSelected) : [];
    }
  }

  // Move left to right
  moveMultipleToSelected() {
    this.selectedData.push(...this.leftSelected);
    this.leftSelected = [];
    this.allLeftSelected = false;
  }

  // Move right to left
  moveMultipleToPrimary() {
    this.selectedData = _.differenceBy(this.selectedData, this.rightSelected, 'id');
    this.rightSelected = [];
    this.allRightSelected = false;
  }

  // Clear search
  clearSearch(side: 'left' | 'right') {
    if (side === 'left') this.leftSearch = '';
    else this.rightSearch = '';
  }
}