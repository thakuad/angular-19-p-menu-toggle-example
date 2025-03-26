// menu.service.ts
import { Injectable } from '@angular/core';
import {BehaviorSubject, filter} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {ABOUT_MENU_ITEMS, ADMIN_MENU_ITEMS} from '../config/session-menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private sidebarItemsSource = new BehaviorSubject<MenuItem[]>([]);
  sidebarItems$ = this.sidebarItemsSource.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event=> event instanceof NavigationEnd)).subscribe(() => {
        this.initializeSidebarBasedOnRoute()
    })

  }

  // Update sidebar items based on the selected top menu item
  updateSidebarItems(items: MenuItem[]) {
    this.sidebarItemsSource.next(items);
  }

  // Initialize the sidebar based on the current route
  initializeSidebarBasedOnRoute() {
    const currentRoute = this.router.url.split('/')[1]; // Get the first part of the URL path
    this.setSidebarItemsBasedOnRoute(currentRoute);  // Set sidebar items based on route
  }

  // Set sidebar items based on the route
  private setSidebarItemsBasedOnRoute(route: string) {
    if (route.startsWith('admin')) {
      this.updateSidebarItems(ADMIN_MENU_ITEMS);
    } else if (route.startsWith('about')) {
      this.updateSidebarItems(ABOUT_MENU_ITEMS);
    } else {
      this.updateSidebarItems([]); // Default case, no items to show
    }
  }


}
