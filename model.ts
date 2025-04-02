interface DropdownOption {
  label: string;
  value: string;
}

interface Option {
  groups: string[];
  dropdownOptions: DropdownOption[];
}



this.someObservable$.subscribe(dataArray => {
  this.userList = Array.from(new Set(dataArray.map(item => item.user)))
    .map(user => ({ label: user, value: user }));
});


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


fetchSessions() {
    this.http.get<Session[]>('API_ENDPOINT_HERE')
      .pipe(
        map((sessions) => ({
          sessionList: sessions.map(({ id, name, uuid }) => ({ id, name, uuid })),
          addressList: sessions.flatMap(session => session.address)
        }))
      )
      .subscribe(({ sessionList, addressList }) => {
        this.sessionSubject.next(sessionList);
        this.addressSubject.next(addressList);
      });
  }
}