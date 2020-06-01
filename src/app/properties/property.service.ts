import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { format as formatDate } from 'date-fns';

import { Property, PropertyDetails } from '../shared/models/property.model';
import { Note } from '../shared/models/note.model';
import { Offer } from '../shared/models/offer.model';
import { Viewing } from '../shared/models/viewing.model';
import { getCurrentTimestamp } from '../shared/utils';
import { NOTE_TYPES } from '../shared/services/app-constants.service';
import { AccountService } from '../account/account.service';

@Injectable()
export class PropertyService {
  properties: Property[] = [];
  propertiesChangedSub: Subject<Property[]> = new Subject<Property[]>();
  propertyNotesChangedSub: Subject<Property> = new Subject<Property>();

  constructor(private accountService: AccountService) {};

  getProperties(): Property[] {
    return this.properties.slice(); 
  }

  setProperties(properties: Property[]): void {
    this.properties = properties;
    this.emitPropertiesChanged();
  }

  getProperty(uid: string): Property {
    return this.properties.find((property) => {
      return property.uid === uid;
    });
  }

  addNoteToProperty(propertyId: string, note: Note, keepSilent: boolean = false): void {
    const property = this.getProperty(propertyId);
    property.notes.push(note);
    
    if (!keepSilent) {
      this.emitPropertiesChanged();
    }
  }

  makeOfferOnProperty(propertyId: string, offer: Offer, keepSilent: boolean = false): void {
    const property = this.getProperty(propertyId);
    property.offers.push(offer);
    
    if (!keepSilent) {
      this.emitPropertiesChanged();
    }
  }

  bookViewingOfProperty(propertyId: string, viewing: Viewing, keepSilent: boolean = false): void {
    const property = this.getProperty(propertyId);
    property.viewings.push(viewing);

    if (!keepSilent) {
      this.emitPropertiesChanged();
    }
  }

  cancelViewingOfProperty(propertyId: string, viewingIndex: number): void {
    const property = this.getProperty(propertyId);
    property.viewings[viewingIndex].cancelled = true;

    const userName: string = this.getUserName();
    const currentTimestamp: string = getCurrentTimestamp();
    const viewingTimestamp: number = +property.viewings[viewingIndex].timestamp;
    const formattedViewingDate: string = formatDate(new Date(viewingTimestamp), 'dd/MM/yyyy HH:mm');

    const cancellationNote: Note = new Note(`Cancelled the viewing on ${formattedViewingDate}`, currentTimestamp, NOTE_TYPES.VIE.key, userName);
    
    // We'll let the addNoteToProperty method to call emit once the note was pushed
    // That emit will notify the subscribers about the viewing cancellation as well
    this.addNoteToProperty(propertyId, cancellationNote);
  }

  updatePropertyDetails(propertyDetails: PropertyDetails): void {
    const property = this.getProperty(propertyDetails.uid);
    Object.keys(propertyDetails).map(key => {
      property[key] = propertyDetails[key];
    });
    this.emitPropertiesChanged();
  }

  addProperty(propertyDetails: PropertyDetails): void {
    const createTimestamp: string = getCurrentTimestamp();
    const userName: string = this.getUserName();
    const createNote: Note = new Note(
      'Property sheet created',
      createTimestamp,
      NOTE_TYPES.NOT.key,
      userName
    );

    const property = new Property(
      propertyDetails.uid,
      createTimestamp,
      propertyDetails.addressLine1,
      propertyDetails.addressLine2,
      propertyDetails.postcode,
      propertyDetails.town,
      propertyDetails.thumbnailUrl,
      propertyDetails.bedrooms,
      propertyDetails.size,
      propertyDetails.epc,
      propertyDetails.type,
      propertyDetails.dealType,
      propertyDetails.askingPrice,
      propertyDetails.marketTimestamp,
      propertyDetails.links,
      
      [createNote],
      [],
      []
    );
    this.properties.push(property);
    this.emitPropertiesChanged();
  }

  deleteProperty(propertyId: string): void {
    let index: number = this.properties.findIndex((property, index) => {
      return property.uid == propertyId;
    });
    
    console.log('[PropertyService] - deleteProperty() BEFORE - properties: ', this.properties);
    if (index >= 0) {
      this.properties.splice(index, 1);
      console.log('[PropertyService] - deleteProperty() AFTER - properties: ', this.properties);
      this.emitPropertiesChanged();
    }
  }

  reset(): void {
    this.setProperties([]);
  }

  emitPropertiesChanged(): void {
    this.propertiesChangedSub.next(this.properties.slice());
  }

  getUserName(): string {
    return this.accountService.getAccount().user.public_profile.displayName;
  }
}