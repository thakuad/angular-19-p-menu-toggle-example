import { Routes } from '@angular/router';
import {AboutUsComponent} from './about-us/about-us.component';
import {AdminComponent} from './admin/admin.component';
import {AboutTeamComponent} from './about-team/about-team.component';

export const routes: Routes = [
  {path:"", redirectTo:"/about", pathMatch: "full"},
  {path: "about", component: AboutUsComponent },
  {path: "admin", component: AdminComponent},
  {path: "about-team", component: AboutTeamComponent}
];
