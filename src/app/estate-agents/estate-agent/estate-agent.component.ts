import { Component, OnInit, ViewChild, OnDestroy, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { format as formatDate } from 'date-fns';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Note } from 'src/app/shared/models/note.model';
import { getCurrentTimestamp, sortArrayByKey } from 'src/app/shared/utils';
import { EstateAgentService } from '../estate-agent.service';
import { AccountService } from 'src/app/account/account.service';
import { NOTE_TYPES } from 'src/app/shared/services/app-constants.service';
import { Property } from 'src/app/shared/models/property.model';
import { PropertyService } from 'src/app/properties/property.service';
import { AddNoteModalComponent } from 'src/app/modals/add-note-modal/add-note-modal.component';
import { AddNegotiatorModalComponent } from 'src/app/modals/add-negotiator-modal/add-negotiator-modal.component';
import { FormatFullAddressPipe } from 'src/app/shared/pipes/format-full-address.pipe';
import { EstateAgent } from 'src/app/shared/models/estate-agent.model';
import { NegotiatorDetails } from 'src/app/shared/models/negotiator-details.model';
import { Person } from 'src/app/shared/models/person.model';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';
import { ConfirmActionModalComponent } from 'src/app/modals/confirm-action-modal/confirm-action-modal.component';

@Component({
  selector: 'app-estate-agent',
  templateUrl: './estate-agent.component.html'
})
export class EstateAgentComponent implements OnInit, OnDestroy {
  @ViewChild(AddNoteModalComponent, {static: false}) addNoteModal: AddNoteModalComponent;
  @ViewChild(AddNegotiatorModalComponent, {static: false}) addNegotiatorModal: AddNegotiatorModalComponent;
  @ViewChild(PlaceholderDirective, {static: false}) confirmModalHost: PlaceholderDirective;

  estateAgentChangeSub: Subscription;
  confirmationModalCancelSub: Subscription;
  confirmationModalConfirmSub: Subscription;
  actionConfirmModalComponentRef: ComponentRef<any>;

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

  sorteddNegotiators: Person[];
  negotiatorIdToRemove: number;
  isLoading: boolean;
  deactivateNegotiatorMode: boolean;

  addNoteMode: boolean;
  noteTypes: any = NOTE_TYPES;

  addNegotiatorMode: boolean;

  maxNotesToShow: number = 5;

  constructor(private accountService: AccountService,
              private propertyService: PropertyService,
              private estateAgentService: EstateAgentService,
              private route: ActivatedRoute,
              private router: Router,
              private formatFullAddressPipe: FormatFullAddressPipe,
              private dataStorageService: DataStorageService,
              private componentFactoryResolver: ComponentFactoryResolver) { }

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

    this.estateAgentChangeSub = this.estateAgentService.estateAgentsChanged.subscribe(estateAgents => {
      this.initEstateAgent();

      this.dataStorageService.storeEstateAgent(this.id).then(() => {
        if (this.addNoteMode) {
          this.addNoteModal.onComplete();
        }

        if (this.addNegotiatorMode) {
          this.addNegotiatorModal.onComplete();
        }
      }, error => {
        console.error('There was an error when trying to update the EA - error message: ', error);
      });
    });
  }

  ngOnDestroy(): void {
    this.estateAgentChangeSub.unsubscribe;
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

    // This is a little convoluted, but gets the job done...
    this.sorteddNegotiators = sortArrayByKey('deleted', this.estateAgent.negotiators);
    this.sorteddNegotiators = sortArrayByKey('index', this.sorteddNegotiators).reverse().sort((personA: Person) => {
      return personA.deleted ? 1 : -1;
    });
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
    if (!this.estateAgent.propertyIds || !this.estateAgent.propertyIds.length) {
      return [];
    }

    return this.estateAgent.propertyIds.map((propertyId) => {
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

  onAddNegotiator(): void {
    this.addNegotiatorMode = true;
  }

  onNegotiatorAdded(negotiatorDetails: NegotiatorDetails): void {
    const negotiator: Person = {
      firstName: negotiatorDetails.firstName,
      lastName: negotiatorDetails.lastName,
      phone: negotiatorDetails.phone,
      email: negotiatorDetails.email
    };

    this.estateAgentService.addNegotiatorToEstateAgent(this.id, negotiator);
  }

  onAddNegotiatorModalClosed(): void {
    this.addNegotiatorMode = false;
  }

  onDeactivateNegotiator(index: number): void {
    this.negotiatorIdToRemove = index;
    this.isLoading = true;
    this.deactivateNegotiatorMode = true;
    const message: string = 'remove this negotiator from this EA';
    const additionalMessage: string = 'Please note this action also removes the negotiator\'s details from every property the negotiator is linked to';

    this.showConfirmationModal(message, additionalMessage).then(() => {
      console.log('[EstateAgentComponent] - onDeactivateNegotiator() - index: ', index);
      // this.estateAgentService.deactivateNegotiatorOfEstateAgent(this.id, index, true);
      // STEP 2 - Remove negotiator from any linked property...
    }, error => {});
  }

  showConfirmationModal(message: string, additionalMessage?: string): Promise<void> {
    const confirmModalComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmActionModalComponent);
    const hostViewContainerRef = this.confirmModalHost.viewContainerRef;
    hostViewContainerRef.clear();

    this.actionConfirmModalComponentRef = hostViewContainerRef.createComponent(confirmModalComponentFactory);
    this.actionConfirmModalComponentRef.instance.message = message;
    if (additionalMessage) {
      this.actionConfirmModalComponentRef.instance.additionalMessage = additionalMessage;
    }
    this.actionConfirmModalComponentRef.instance.show();

    return new Promise((resolve, reject) => {
      this.confirmationModalConfirmSub = this.actionConfirmModalComponentRef.instance.confirm.subscribe(() => {
        this.confirmationModalConfirmSub.unsubscribe();
        hostViewContainerRef.clear();
        resolve();
      });
      this.confirmationModalCancelSub = this.actionConfirmModalComponentRef.instance.cancel.subscribe(() => {
        this.confirmationModalCancelSub.unsubscribe();
        hostViewContainerRef.clear();
        reject();
      });
    });
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
