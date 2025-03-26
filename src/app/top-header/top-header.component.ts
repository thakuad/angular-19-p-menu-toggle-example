import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuService} from '../../services/menu.service';
import {ABOUT_MENU_ITEMS, ADMIN_MENU_ITEMS, SESSION_MENU_ITEMS} from '../../config/session-menu';
import {EVENT_MENU_ITEMS} from '../../config/event-menu';
import {MenubarModule} from 'primeng/menubar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css'],
  imports: [
    MenubarModule,
    RouterLink,
    RouterLinkActive,
    Button
  ],
  standalone: true
})
export class TopHeaderComponent implements OnInit {
  @Input() toggleDarkMode!: () => void;

  menuItems: MenuItem[] = [];


  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuItems = [ {
      label: 'About Us',
      routerLink: "/about",
      command: () => this.menuService.updateSidebarItems(ABOUT_MENU_ITEMS),
    },
      {
        label: 'Admin',
        routerLink: "/admin",
        command: () => this.menuService.updateSidebarItems(ADMIN_MENU_ITEMS),
      }
    ];
  }

  updateSidebar(items: MenuItem[]) {
    this.menuService.updateSidebarItems(items);
  }
}
