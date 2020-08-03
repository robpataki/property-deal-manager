import { Component, Input } from '@angular/core';

import { EstateAgent } from 'src/app/shared/models/estate-agent.model';

@Component({
  selector: 'app-estate-agent-detail',
  templateUrl: './estate-agent-detail.component.html'
})
export class EstateAgentDetailComponent {
  @Input() estateAgent: EstateAgent;
}
