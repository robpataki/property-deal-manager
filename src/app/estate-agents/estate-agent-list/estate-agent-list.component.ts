import { OnInit, Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { EstateAgent } from 'src/app/shared/models/estate-agent.model';
import { EstateAgentService } from '../estate-agent.service';
import { sortArrayByKey } from  '../../shared/utils';

@Component({
  selector: 'app-estate-agent-list',
  templateUrl: './estate-agent-list.component.html'
})
export class EstateAgentListComponent implements OnInit {
  estateAgents: EstateAgent[] = [];
  sortedEstateAgents: EstateAgent[] = [];
  estateAgentsChangedSup: Subscription;

  constructor(private estateAgentService: EstateAgentService) {

  }

  ngOnInit(): void {
    this.initEstateAgents(this.estateAgentService.getEstateAgents());

    this.estateAgentsChangedSup = this.estateAgentService.estateAgentsChanged.subscribe((estateAgents: EstateAgent[]) => {
      this.initEstateAgents(estateAgents);
    });
  }

  initEstateAgents(estateAgents: EstateAgent[]): void {
    this.estateAgents = estateAgents;
    this.sortedEstateAgents = sortArrayByKey('createTimestamp', this.estateAgents).reverse();
  }

  ngOnDestroy(): void {
    this.estateAgentsChangedSup.unsubscribe();
  }
}
