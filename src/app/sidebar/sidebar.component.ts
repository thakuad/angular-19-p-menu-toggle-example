import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {MenuService} from '../../services/menu.service';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    Menu,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    // Subscribe to changes in the sidebar menu items
    this.menuService.sidebarItems$.subscribe((items) => {
      this.menuItems = items;
    });
  }}
