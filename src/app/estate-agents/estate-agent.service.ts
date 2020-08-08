import { Injectable, EventEmitter } from '@angular/core';
import { EstateAgent } from '../shared/models/estate-agent.model';
import { Person } from '../shared/models/person.model';
import { Note } from '../shared/models/note.model';

@Injectable()
export class EstateAgentService {
  estateAgents: EstateAgent[] = [];
  estateAgentsChanged: EventEmitter<EstateAgent[]> = new EventEmitter<EstateAgent[]>();

  constructor() {};

  getEstateAgents(): EstateAgent[] {
    return this.estateAgents.slice(0);
  }

  setEstateAgents(estateAgents: EstateAgent[]): void {
    this.estateAgents = estateAgents;
    this.emitChanges();
  }

  addEstateAgent(estateAgent: EstateAgent): void {
    this.estateAgents.push(estateAgent);
    this.emitChanges();
  }

  getEstateAgent(uid: string): EstateAgent {
    return this.estateAgents.find((estateAgent) => {
      return estateAgent.uid === uid;
    });
  }

  setEstateAgent(uid: string, estateAgent: EstateAgent): void {
    let index: number = this.estateAgents.findIndex((estateAgent) => {
      return estateAgent.uid === uid;
    });

    if (index >= 0) {
      this.estateAgents[index] = estateAgent;
      this.emitChanges();
    }
  }

  deleteEstateAgent(uid: string): void {
    let index: number = this.estateAgents.findIndex((estateAgent) => {
      return estateAgent.uid == uid;
    });

    if (index >= 0) {
      this.estateAgents.splice(index, 1);
      this.emitChanges();
    }
  }

  addNoteToEstateAgent(estateAgentId: string, note: Note, keepSilent?: boolean): void {
    const estateAgent: EstateAgent = this.getEstateAgent(estateAgentId);
    estateAgent.notes.push(note);

    if (!keepSilent) {
      this.emitChanges();
    }
  }

  addPropertyToEstateAgent(estateAgentId: string, propertyId: string, keepSilent?: boolean) {
    const estateAgent: EstateAgent = this.getEstateAgent(estateAgentId);

    if (!estateAgent.propertyIds.includes(propertyId)) {
      estateAgent.propertyIds.push(propertyId);
    }

    if (!keepSilent) {
      this.emitChanges();
    }
  }

  removePropertyFromEstateAgent(estateAgentId: string, propertyId: string, keepSilent?: boolean) {
    const estateAgent: EstateAgent = this.getEstateAgent(estateAgentId);

    let index: number = estateAgent.propertyIds.findIndex((property) => {
      return property === propertyId;
    });

    if (index >= 0) {
      estateAgent.propertyIds.splice(index, 1);

      if (!keepSilent) {
        this.emitChanges();
      }
    }
  }

  getEstateAgentsByPostcode(postcode: string): EstateAgent[] {
    return this.estateAgents.filter(estateAgent => {
      if (estateAgent.postcode.toUpperCase().substr(0, postcode.length) === postcode.toUpperCase()) {
        return estateAgent;
      }
    }).sort((a, b) => {
      return a.postcode > b.postcode ? 1 : -1;
    });
  }

  reset(): void {
    this.estateAgents = [];
  }

  emitChanges(): void {
    this.estateAgentsChanged.emit(this.estateAgents.slice());
  }
}
