import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComparableComponent } from './comparable/comparable.component';
import { ComparableEditComponent } from './comparable-edit/comparable-edit.component';
import { ComparableListComponent } from './comparable-list/comparable-list.component';
import { ComparableLinkComponent } from './comparable-link/comparable-link.component';

const routes: Routes = [
  { path: '', component: ComparableListComponent },
  { path: 'new', component: ComparableEditComponent },
  { path: 'link', component: ComparableLinkComponent },
  { path: ':id', component: ComparableComponent },
  { path: ':id/edit', component: ComparableEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComparablesRoutingModule {}