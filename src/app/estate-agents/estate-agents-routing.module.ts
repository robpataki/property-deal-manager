import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstateAgentComponent } from './estate-agent/estate-agent.component';
import { EstateAgentListComponent } from './estate-agent-list/estate-agent-list.component';
import { EstateAgentEditComponent } from './estate-agent-edit/estate-agent-edit.component';

const routes: Routes = [
  { path: '', component: EstateAgentListComponent },
  { path: 'new', component: EstateAgentEditComponent },
  { path: ':id', component: EstateAgentComponent },
  { path: ':id/edit', component: EstateAgentEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstateAgentsRoutingModule {}
