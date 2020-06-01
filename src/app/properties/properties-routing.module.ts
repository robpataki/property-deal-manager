import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyComponent } from './property/property.component';
import { PropertyEditComponent } from './property-edit/property-edit.component';

const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: 'new', component: PropertyEditComponent },
  { path: ':id', component: PropertyComponent },
  { path: ':id/edit', component: PropertyEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertiesRoutingModule {}