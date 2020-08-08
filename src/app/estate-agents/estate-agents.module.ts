import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/modules/shared.module';
import { EstateAgentsRoutingModule } from './estate-agents-routing.module';
import { AddNoteModalModule } from '../modals/add-note-modal/add-note-modal.module';

import { AddNegotiatorModalComponent } from '../modals/add-negotiator-modal/add-negotiator-modal.component';
import { EstateAgentListComponent } from './estate-agent-list/estate-agent-list.component';
import { EstateAgentEditComponent } from './estate-agent-edit/estate-agent-edit.component';
import { EstateAgentDetailComponent } from './estate-agent-detail/estate-agent-detail.component';
import { EstateAgentComponent } from './estate-agent/estate-agent.component';

@NgModule({
  declarations: [
    EstateAgentComponent,
    EstateAgentListComponent,
    EstateAgentDetailComponent,
    EstateAgentEditComponent,
    AddNegotiatorModalComponent
  ],
  imports: [
    SharedModule,
    EstateAgentsRoutingModule,
    ReactiveFormsModule,
    AddNoteModalModule
  ],
  exports: [
    SharedModule
  ]
})
export class EstateAgentsModule {}
