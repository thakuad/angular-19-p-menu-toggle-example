import { Component, OnInit } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import {TopHeaderComponent} from './top-header/top-header.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import { NgIf} from '@angular/common';
import {MenuService} from '../services/menu.service';
import {ThemeService} from '../config/theme.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [ButtonModule, TextareaModule, InputTextModule, MenubarModule, TopHeaderComponent, SidebarComponent, RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements  OnInit{
  title = 'next-ui-angular';



  constructor(private menuService: MenuService, private router: Router, private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize the menu based on the current URL
    this.menuService.initializeSidebarBasedOnRoute();
    this.themeService.initTheme()
  }

  sidebarVisible = true;  // Controls the visibility of the sidebar

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;  // Toggles sidebar visibility
  }

  toggleDarkMode () {
    this.themeService.toggleDarkMode()
  }


}
