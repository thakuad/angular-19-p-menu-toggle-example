import { MenuItem } from 'primeng/api';

export const SESSION_MENU_ITEMS: MenuItem[] = [
  { label: 'Session', routerLink: '/about' },
  { label: 'Session Config', routerLink: '/admin' },
  { label: 'Session Manager', routerLink: '/about' },
  { label: 'Session Event', routerLink: '/admin' }
];


export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { label: 'User Management', routerLink: '/admin' },
  { label: 'System Settings', routerLink: '/admin-settings' },
  { label: 'Access Logs', routerLink: '/admin-logs' }
];


export const ABOUT_MENU_ITEMS: MenuItem[] = [
  { label: 'Company Info', routerLink: '/about' },
  { label: 'Our Team', routerLink: '/about-team' },
  { label: 'Mission & Vision', routerLink: '/about-mission' }
];
