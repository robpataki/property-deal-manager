import { Component, OnInit, ViewChild } from '@angular/core';
import { format as formatDate } from 'date-fns';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Note } from 'src/app/shared/models/note.model';
import { getCurrentTimestamp, sortArrayByKey } from 'src/app/shared/utils';
import { EstateAgentService } from '../estate-agent.service';
import { AccountService } from 'src/app/account/account.service';
import { NOTE_TYPES } from 'src/app/shared/services/app-constants.service';
import { Property } from 'src/app/shared/models/property.model';
import { PropertyService } from 'src/app/properties/property.service';
import { AddNoteModalComponent } from 'src/app/modals/add-note-modal/add-note-modal.component';
import { FormatFullAddressPipe } from 'src/app/shared/pipes/format-full-address.pipe';
import { EstateAgent } from 'src/app/shared/models/estate-agent.model';

@Component({
  selector: 'app-estate-agent',
  templateUrl: './estate-agent.component.html'
})
export class EstateAgentComponent implements OnInit {
  @ViewChild(AddNoteModalComponent, {static: false}) addNoteModal: AddNoteModalComponent;

  id: string;
  estateAgentId: string;
  estateAgent: EstateAgent;
  propertyId: string;
  property: Property;
  properties: Property[];
  sortedProperties: Property[];
  backButtonLabel: string;
  backButtonUrl: string;

  notes: Note[];
  sortedNotes: Note[];

  addNoteMode: boolean;
  noteTypes: any = NOTE_TYPES;

  maxNotesToShow: number = 5;

  constructor(private accountService: AccountService,
              private propertyService: PropertyService,
              private estateAgentService: EstateAgentService,
              private route: ActivatedRoute,
              private router: Router,
              private formatFullAddressPipe: FormatFullAddressPipe) {}

  ngOnInit(): void {
    this.setUpBackButton();

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.initEstateAgent();
      }
    );

    this.route.queryParams.subscribe(params => {
      this.estateAgentId = params['estateAgentId'];
      this.estateAgent = this.estateAgentService.getEstateAgent(this.estateAgentId);
      this.initEstateAgent();
      this.setUpBackButton();
    });
  }

  setUpBackButton(): void {
    this.backButtonLabel = !!this.estateAgentId ? 'Back to property card' : 'Back to EAs';
    this.backButtonUrl = !!this.estateAgentId ? `/properties/${this.estateAgentId}#s-estate-agent` : `/estate-agents`;
  }

  initEstateAgent(): void {
    this.estateAgent = this.estateAgentService.getEstateAgent(this.id);
    if (!this.estateAgent) {
      this.router.navigate(['/not-found']);
      return;
    }
    this.getEstateAgentData();
  }

  getEstateAgentData(): void {
    this.notes = this.getNotes();
    this.sortedNotes = sortArrayByKey('timestamp', this.notes).reverse();

    this.properties = this.getProperties();
    this.sortedProperties = sortArrayByKey('createTimestamp', this.properties).reverse();
  }

  // Return array of date DESC notes
  getNotes(): Note[] {
    if (!this.estateAgent.notes || !this.estateAgent.notes.length) {
      return [];
    }

    return this.estateAgent.notes.map((note) => {
      const formattedDate = formatDate(new Date(+note.timestamp), 'dd/MM/yyyy HH:mm:ss');

      return {
        date: formattedDate,
        timestamp: note.timestamp,
        type: NOTE_TYPES[note.type].key,
        estateAgentId: note.estateAgentId || null,
        rawType: note.type,
        text: note.text,
        userName: note.userName
      };
    });
  }

  getProperties(): Property[] {
    if (!this.estateAgent.properties || !this.estateAgent.properties.length) {
      return [];
    }

    return this.estateAgent.properties.map((propertyId) => {
      return this.propertyService.getProperty(propertyId);
    });
  }

  getCurrentUserName(): string {
    return this.accountService.getAccount().user.public_profile.displayName;
  }

  onAddNote(): void {
    this.addNoteMode = true;
  }

  onNoteAdded(note: string): void {
    const newNote: Note = {
      text: note,
      timestamp: getCurrentTimestamp(),
      type: NOTE_TYPES.NOT.key,
      userName: this.getCurrentUserName()
    }

    if (!!this.estateAgentId) {
      newNote.estateAgentId = this.estateAgentId;
    }
    this.estateAgentService.addNoteToEstateAgent(this.id, newNote);
  }

  onAddNoteModalClosed(): void {
    this.addNoteMode = false;
  }

  getProperty(propertyId: string): Property {
    return this.propertyService.getProperty(propertyId);
  }

  getPropertyAddress(propertyId: string): string {
    const property = this.getProperty(propertyId);
    if (!property) {
      return '';

    }
    return this.formatFullAddressPipe.transform(property.addressLine1, property.addressLine2, property.town, property.postcode);
  }
}
