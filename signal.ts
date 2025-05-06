import { Component, Input, OnInit, signal, computed } from '@angular/core';
import _ from 'lodash';

@Component({
  selector: 'app-compare-list',
  templateUrl: './compare-list.component.html',
  styleUrls: ['./compare-list.component.css'],
  standalone: false
})
export class CompareListComponent implements OnInit {
  @Input() set primaryDataInput(value: any[]) {
    this.primaryData.set(value);
  }

  @Input() set selectedDataInput(value: any[]) {
    this.selectedData.set(value);
    this.initialSelected.set(_.cloneDeep(value));
  }

  // Signals for data
  primaryData = signal<any[]>([]);
  selectedData = signal<any[]>([]);
  initialSelected = signal<any[]>([]);

  // Signals for UI state
  leftSearch = signal('');
  rightSearch = signal('');

  leftSelected = signal<any[]>([]);
  rightSelected = signal<any[]>([]);

  // Computed filtered + sorted
  sortedFilteredPrimary = computed(() => {
    const unselected = _.differenceBy(this.primaryData(), this.selectedData(), 'id');
    const filtered = _.filter(unselected, item =>
      item.name.toLowerCase().includes(this.leftSearch().toLowerCase())
    );
    return _.orderBy(filtered, ['name'], ['asc']);
  });

  sortedFilteredSelected = computed(() => {
    const filtered = _.filter(this.selectedData(), item =>
      item.name.toLowerCase().includes(this.rightSearch().toLowerCase())
    );
    return _.orderBy(filtered, ['name'], ['asc']);
  });

  // Select All computed
  allLeftSelected = computed({
    get: () =>
      this.sortedFilteredPrimary().length > 0 &&
      _.differenceBy(this.sortedFilteredPrimary(), this.leftSelected(), 'id').length === 0,
    set: (value: boolean) =>
      this.leftSelected.set(value ? _.clone(this.sortedFilteredPrimary()) : [])
  });

  allRightSelected = computed({
    get: () =>
      this.sortedFilteredSelected().length > 0 &&
      _.differenceBy(this.sortedFilteredSelected(), this.rightSelected(), 'id').length === 0,
    set: (value: boolean) =>
      this.rightSelected.set(value ? _.clone(this.sortedFilteredSelected()) : [])
  });

  // Compare with initial state
  hasChanges = computed(() =>
    !_.isEqual(
      _.orderBy(this.initialSelected(), ['id']),
      _.orderBy(this.selectedData(), ['id'])
    )
  );

  ngOnInit(): void {}

  // Search
  clearSearch(side: 'left' | 'right') {
    side === 'left' ? this.leftSearch.set('') : this.rightSearch.set('');
  }

  // Move operations
  moveMultipleToSelected() {
    this.selectedData.set([
      ...this.selectedData(),
      ...this.leftSelected()
    ]);
    this.leftSelected.set([]);
  }

  moveMultipleToPrimary() {
    this.selectedData.set(_.differenceBy(this.selectedData(), this.rightSelected(), 'id'));
    this.rightSelected.set([]);
  }

  resetSelection() {
    this.selectedData.set(_.cloneDeep(this.initialSelected()));
    this.leftSelected.set([]);
    this.rightSelected.set([]);
  }
}