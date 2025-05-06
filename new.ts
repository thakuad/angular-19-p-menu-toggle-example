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

  // Sorted and filtered unselected items (left side)
  get sortedFilteredPrimary() {
    const unselected = _.differenceBy(this.primaryData, this.selectedData, 'id');
    const filtered = _.filter(unselected, item =>
      item.name.toLowerCase().includes(this.leftSearch.toLowerCase())
    );
    return _.orderBy(filtered, ['name'], ['asc']);
  }

  // Sorted and filtered selected items (right side)
  get sortedFilteredSelected() {
    const filtered = _.filter(this.selectedData, item =>
      item.name.toLowerCase().includes(this.rightSearch.toLowerCase())
    );
    return _.orderBy(filtered, ['name'], ['asc']);
  }

  // Dynamic Select All (LEFT)
  get allLeftSelected(): boolean {
    return this.sortedFilteredPrimary.length > 0 &&
      _.differenceBy(this.sortedFilteredPrimary, this.leftSelected, 'id').length === 0;
  }
  set allLeftSelected(value: boolean) {
    this.leftSelected = value ? _.clone(this.sortedFilteredPrimary) : [];
  }

  // Dynamic Select All (RIGHT)
  get allRightSelected(): boolean {
    return this.sortedFilteredSelected.length > 0 &&
      _.differenceBy(this.sortedFilteredSelected, this.rightSelected, 'id').length === 0;
  }
  set allRightSelected(value: boolean) {
    this.rightSelected = value ? _.clone(this.sortedFilteredSelected) : [];
  }

  // Move selected from left to right
  moveMultipleToSelected() {
    this.selectedData.push(...this.leftSelected);
    this.leftSelected = [];
  }

  // Move selected from right to left
  moveMultipleToPrimary() {
    this.selectedData = _.differenceBy(this.selectedData, this.rightSelected, 'id');
    this.rightSelected = [];
  }

  // Clear search
  clearSearch(side: 'left' | 'right') {
    if (side === 'left') this.leftSearch = '';
    else this.rightSearch = '';
  }
}