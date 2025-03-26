import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  // Toggle dark mode on the entire HTML document
  toggleDarkMode() {
    const htmlElement = document.documentElement; // Access the <html> element
    htmlElement.classList.toggle('dark'); // Toggle dark mode class on the <html> element

    // Check if dark mode is now enabled
    const isDarkMode = htmlElement.classList.contains('dark');

    // Save the theme state to localStorage so that it persists across page reloads
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }

  // Initialize theme based on saved preference
  initTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      const isDarkMode = JSON.parse(savedTheme);
      if (isDarkMode) {
        // Apply dark mode to the <html> element
        document.documentElement.classList.add('dark');
      }
    }
  }
}
