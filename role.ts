// user-role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserRoleService {
  private rolesSubject = new BehaviorSubject<string[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) {}

  async loadRoles(): Promise<void> {
    const roles = await firstValueFrom(this.http.get<string[]>('/api/user/roles'));
    this.rolesSubject.next(roles);
  }

  get roles(): string[] {
    return this.rolesSubject.value;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(import { provideRouter, withRouterConfig } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' }))
  ]
});




