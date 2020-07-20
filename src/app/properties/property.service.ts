import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { format as formatDate } from 'date-fns';

import { Property, PropertyDetails } from '../shared/models/property.model';
import { Note } from '../shared/models/note.model';
import { Offer } from '../shared/models/offer.model';
import { Viewing } from '../shared/models/viewing.model';
import { getCurrentTimestamp } from '../shared/utils';
import { NOTE_TYPES, STRATEGIES } from '../shared/services/app-constants.service';
import { AccountService } from '../account/account.service';

@Injectable()
export class PropertyService {
  properties: Property[] = [];
  propertiesChangedSub: Subject<Property[]> = new Subject<Property[]>();

  constructor(private accountService: AccountService) {};

  getProperties(): Property[] {
    return this.properties.slice();
  }

  setProperties(properties: Property[]): void {
    this.properties = properties;
    this.emitChanges();
  }

  getProperty(uid: string): Property {
    return this.properties.find((property) => {
      return property.uid === uid;
    });
  }

  addComparableToProperty(propertyId: string, comparableId: string, keepSilent?: boolean): void {
    const property: Property = this.getProperty(propertyId);

    if (!property.comparables.includes(comparableId)) {
      property.comparables.push(comparableId);
    }

    if (!keepSilent) {
      this.emitChanges();
    }
  }

  removeComparableFromProperty(propertyId: string, comparableId: string, keepSilent?: boolean): void {
    const property: Property = this.getProperty(propertyId);
    const index = property.comparables.indexOf(comparableId);

    if (index >= 0) {
      property.comparables.splice(index, 1);

      if (!keepSilent) {
        this.emitChanges();
      }
    }
  }

  deleteComparable(comparableId: string, keepSilent?: boolean): void {
    let deletionPerformed: boolean = false;
    this.properties.map(property => {
      const index = property.comparables.indexOf(comparableId);
      if (index >= 0) {
        deletionPerformed = true;
        property.comparables.splice(index, 1);
      }
    });

    if (deletionPerformed && !keepSilent) {
      this.emitChanges();
    }
  }

  getPropertiesOfComparable(comparableId: string): Property[] {
    return this.properties.filter((property) => {
      if (property.comparables.includes(comparableId)) {
        return property;
      }
    });
  }

  addNoteToProperty(propertyId: string, note: Note, keepSilent?: boolean): void {
    const property: Property = this.getProperty(propertyId);
    property.notes.push(note);

    if (!keepSilent) {
      this.emitChanges();
    }
  }

  makeOfferOnProperty(propertyId: string, offer: Offer, keepSilent?: boolean): void {
    const property: Property = this.getProperty(propertyId);
    property.offers.push(offer);

    if (!keepSilent) {
      this.emitChanges();
    }
  }

  bookViewingOfProperty(propertyId: string, viewing: Viewing, keepSilent?: boolean): void {
    const property: Property = this.getProperty(propertyId);
    property.viewings.push(viewing);

    if (!keepSilent) {
      this.emitChanges();
    }
  }

  cancelViewingOfProperty(propertyId: string, viewingIndex: number): void {
    const property: Property = this.getProperty(propertyId);
    property.viewings[viewingIndex].cancelled = true;

    const userName: string = this.getUserName();
    const currentTimestamp: number = getCurrentTimestamp();
    const viewingTimestamp: number = +property.viewings[viewingIndex].timestamp;
    const formattedViewingDate: string = formatDate(new Date(viewingTimestamp), 'dd/MM/yyyy HH:mm');

    const cancellationNote: Note = new Note(`Cancelled the viewing on ${formattedViewingDate}`, currentTimestamp, NOTE_TYPES.VIE.key, userName);

    // We'll let the addNoteToProperty method to call emit once the note was pushed
    // That emit will notify the subscribers about the viewing cancellation as well
    this.addNoteToProperty(propertyId, cancellationNote);
  }

  updatePropertyCrunch(propertyId: string, crunch: any) {
    const property: Property = this.getProperty(propertyId);
    property.crunch = crunch;

    this.emitChanges();
  }

  updatePropertyDetails(propertyDetails: PropertyDetails): void {
    const property: Property = this.getProperty(propertyDetails.uid);
    Object.keys(propertyDetails).map(key => {
      property[key] = propertyDetails[key];
    });
    this.emitChanges();
  }

  addProperty(propertyDetails: PropertyDetails): void {
    const createTimestamp: number = getCurrentTimestamp();
    const userName: string = this.getUserName();
    const createNote: Note = new Note(
      'Property card created',
      createTimestamp,
      NOTE_TYPES.NOT.key,
      userName
    );

    const property = new Property(
      propertyDetails.uid,
      createTimestamp,

      propertyDetails.addressLine1,
      propertyDetails.addressLine2,
      propertyDetails.town,
      propertyDetails.postcode,

      propertyDetails.thumbnailUrl,
      propertyDetails.bedrooms,
      propertyDetails.size,
      propertyDetails.epc,
      propertyDetails.type,
      propertyDetails.tenureType,
      propertyDetails.dealType,
      propertyDetails.askingPrice,
      propertyDetails.marketTimestamp,

      propertyDetails.estateAgentId,
      propertyDetails.vendor,
      propertyDetails.links,
      { strg: STRATEGIES.BTL.key },
      [],

      [ createNote ],
      [],
      []
    );
    this.properties.push(property);
    this.emitChanges();
  }

  deleteProperty(propertyId: string): void {
    let index: number = this.properties.findIndex((property) => {
      return property.uid == propertyId;
    });

    if (index >= 0) {
      this.properties.splice(index, 1);
      this.emitChanges();
    }
  }

  getPropertiesByPostcode(postcode: string): Property[] {
    return this.properties.filter(property => {
      if (property.postcode.substr(0, postcode.length) === postcode) {
        return property;
      }
    })
  }

  setEstateAgentOfProperty(propertyId: string, estateAgentId: string, keepSilent?: boolean): void {
    const property: Property = this.getProperty(propertyId);

    if (!!property) {
      property.estateAgentId = estateAgentId;

      if (!keepSilent) {
        this.emitChanges();
      }
    }
  }

  reset(): void {
    this.setProperties([]);
  }

  emitChanges(): void {
    this.propertiesChangedSub.next(this.properties.slice());
  }

  getUserName(): string {
    return this.accountService.getAccount().user.public_profile.displayName;
  }
}
