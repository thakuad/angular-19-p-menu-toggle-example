interface DropdownOption {
  label: string;
  value: string;
}

interface Option {
  groups: string[];
  dropdownOptions: DropdownOption[];
}


fetchOptions(): void {
    this.http.get<{ groups: string[] }>('/api/options').pipe(
      map(response => ({
        groups: response.groups,
        dropdownOptions: response.groups.map(group => ({
          label: group.charAt(0).toUpperCase() + group.slice(1), // Capitalize first letter
          value: group
        }))
      }))
    ).subscribe(options => {
      this.optionsSubject.next(options); // Update BehaviorSubject
    });
  }
}