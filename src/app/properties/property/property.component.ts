import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

import { Property } from 'src/app/shared/models/property.model';
import { PropertyService } from '../property.service';
import { PROPERTY_TYPES, DEAL_TYPES, NOTE_TYPES, EPC_RATINGS, STRATEGIES } from '../../shared/services/app-constants.service';
import { AccountService } from 'src/app/account/account.service';

import { format as formatDate } from 'date-fns';
import { Note } from 'src/app/shared/models/note.model';
import { AddNoteModalComponent } from 'src/app/modals/add-note-modal/add-note-modal.component';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { OfferRaw, MakeOfferModalComponent } from 'src/app/modals/make-offer-modal/make-offer-modal.component';
import { getCurrentTimestamp, kvObjectToArray, ukDateToUSDate } from '../../shared/utils';
import { Offer } from '../../shared/models/offer.model';
import { CurrencyPipe } from '../../shared/pipes/currency.pipe';
import { ToDateTimePipe } from '../../shared/pipes/to-date-time.pipe';
import { BookingRaw, BookViewingModalComponent } from 'src/app/modals/book-viewing-modal/book-viewing-modal.component';
import { Viewing } from 'src/app/shared/models/viewing.model';
import { TimeFromNowPipe } from 'src/app/shared/pipes/time-from-now.pipe';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html'
})
export class PropertyComponent implements OnInit, OnDestroy {
  @ViewChild(AddNoteModalComponent, {static: false}) addNoteModal: AddNoteModalComponent;
  @ViewChild(MakeOfferModalComponent, {static: false}) makeOfferModal: MakeOfferModalComponent;
  @ViewChild(BookViewingModalComponent, {static: false}) bookViewingModal: BookViewingModalComponent;

  propertiesChangedSub: Subscription;
  property: Property;
  id: string;
  notes: Note[];
  sortedNotes: Note[];
  offers: Offer[];
  sortedOffers: Offer[];
  viewings: Viewing[];
  sortedViewings: Viewing[];
  hasUpcomingViewing: boolean;
  marketDate: string;
  doneViewing: boolean;
  addNoteMode: boolean;
  bookViewingMode: boolean;
  makeOfferMode: boolean;
  marketedFor: string;

  propertyTypes: any = PROPERTY_TYPES;
  dealTypes: any = DEAL_TYPES;
  noteTypes: any = NOTE_TYPES;
  strategies: any = STRATEGIES;

  MAX_LINKS: number = 4;
  
  propertyTypesArray: any[] = kvObjectToArray(PROPERTY_TYPES);
  dealTypesArray: any[] = kvObjectToArray(DEAL_TYPES);
  epcRatingsArray: any[] = kvObjectToArray(EPC_RATINGS);

  constructor(private dataStorageService: DataStorageService,
              private propertyService: PropertyService,
              private route: ActivatedRoute,
              private accountService: AccountService,
              private currencyPipe: CurrencyPipe,
              private toDateTimePipe: ToDateTimePipe,
              private timeFromNowPipe: TimeFromNowPipe) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.property = this.propertyService.getProperty(this.id);
        this.getPropertyData();
      }
    );

    this.propertiesChangedSub = this.propertyService.propertiesChangedSub.subscribe(properties => {
      this.property = this.propertyService.getProperty(this.id);
      this.getPropertyData();

      this.dataStorageService.storeProperty(this.accountService.getAccount().organisationId, this.id).then(() => {
        if (this.addNoteMode) {
          this.addNoteModal.onComplete();
        }

        if (this.makeOfferMode) {
          this.makeOfferModal.onComplete();
        }

        if (this.bookViewingMode) {
          this.bookViewingModal.onComplete();
        }
      }, error => {
        console.error('There was an error when trying to update the property - error message: ', error);
      });
    });
  }

  isUpcomingTime(timestamp: string) {
    return +timestamp > Date.now();
  }

  getPropertyData(): void {
    this.marketDate = this.toDateTimePipe.transform(this.property.marketTimestamp.toString());
    this.marketedFor = this.timeFromNowPipe.transform(this.property.marketTimestamp.toString());

    this.notes = this.getNotes();
    this.sortedNotes = this.sortArrayAscByTimestamp(this.notes).reverse();

    this.viewings = this.getViewings();
    this.sortedViewings = this.sortArrayAscByTimestamp(this.viewings).reverse();

    this.offers = this.getOffers();
    this.sortedOffers = this.sortArrayAscByTimestamp(this.offers).reverse();

    this.hasUpcomingViewing = (this.sortedViewings.filter(viewing => {
      return (this.isUpcomingTime(viewing.timestamp) && !viewing.cancelled);
    })as []).length > 0;

    this.doneViewing = (this.sortedViewings.filter(viewing => {
      return (!this.isUpcomingTime(viewing.timestamp) && !viewing.cancelled);
    })as []).length > 0;
  }

  // Return array of date DESC notes
  getNotes(): any[] {
    if (!this.property.notes || !this.property.notes.length) {
      return [];
    }

    return this.property.notes.map((note) => {
      const formattedDate = formatDate(new Date(+note.timestamp), 'dd/MM/yyyy HH:mm:ss');

      return {
        date: formattedDate,
        timestamp: note.timestamp,
        type: NOTE_TYPES[note.type].key,
        rawType: note.type,
        text: note.text,
        userName: note.userName
      };
    });
  }

  getOffers(): any[] {
    if (!this.property.offers || !this.property.offers.length) {
      return [];
    }

    return this.property.offers.slice();
  }

  getViewings(): Viewing[] {
    if (!this.property.viewings || !this.property.viewings.length) {
      return [];
    }

    return this.property.viewings.slice();
  }

  /*
    * Returns an copy of the passed in array, where the items are 
    * sorted in ascending order by timestamp, and each item contains the original index
    * *
    * Use this for Notes, Viewings and Offers
    * The returned array is an `indexed` array, because it comtains the original item index
  */
  sortArrayAscByTimestamp(array: {timestamp: string, [key: string]: any}[]): any[] {
    if (!array || !array.length) {
      return [];
    }

    return array.map((item, index) => {
      return {
        index: index,
        ...item
      }
    }).sort((a, b) => {
      return (+a.timestamp >= +b.timestamp) ? 1 : -1;
    });
  }

  getCurrentUserName(): string {
    return this.accountService.getAccount().user.public_profile.displayName;
  }

  ngOnDestroy(): void {
    this.propertiesChangedSub.unsubscribe();
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
    
    this.propertyService.addNoteToProperty(this.id, newNote);
  }

  onAddNoteModalClosed(): void {
    this.addNoteMode = false;
  }

  onMakeOffer(): void {
    this.makeOfferMode = true;
  }

  onOfferMade(offer: OfferRaw) {
    const currentUserName: string = this.getCurrentUserName();
    const timestamp: string = getCurrentTimestamp();

    const price: number = +offer.price;
    const formattedPrice: string = this.currencyPipe.transform(+offer.price);
    let text: string = `Made an offer of ${formattedPrice}.`

    if (offer.note && !!offer.note.length) {
      text += `<br>---<br><i>${offer.note}</i>`;
    }

    const newNote: Note = {
      text: text,
      timestamp: timestamp,
      type: NOTE_TYPES.OFF.key,
      userName: currentUserName
    };
    // Add the note but keep it quiet...
    this.propertyService.addNoteToProperty(this.id, newNote, true);

    const newOffer: Offer = new Offer(
      price, 
      timestamp,
      currentUserName
    );

    // This service call won't be quiet!
    this.propertyService.makeOfferOnProperty(this.id, newOffer);
  }

  onMakeOfferModalClosed(): void {
    this.makeOfferMode = false;
  }

  onBookViewing(): void {
    this.bookViewingMode = true;
  }

  onViewingBooked(booking: BookingRaw): void {
    const currentUserName: string = this.getCurrentUserName();
    const timestamp: string = getCurrentTimestamp();
    const usViewingDate: string = ukDateToUSDate(booking.date);
    const viewingTimestamp: number = (new Date(`${usViewingDate} ${booking.hours}:${booking.minutes}`).getTime());
    const formattedViewingDate: string = formatDate(new Date(viewingTimestamp), 'dd/MM/yyyy HH:mm');

    let text: string = `Booked a viewing on ${formattedViewingDate}`;
    if (booking.note && !!booking.note.length) {
      text += `<br>---<br><i>${booking.note}</i>`;
    }

    const newNote: Note = {
      text: text,
      timestamp: timestamp,
      type: NOTE_TYPES.VIE.key,
      userName: currentUserName
    };

    // Add the note but keep it quiet...
    this.propertyService.addNoteToProperty(this.id, newNote, false);

    // This service call won't be quiet!
    const viewing: Viewing = {
      timestamp: viewingTimestamp.toString(),
      cancelled: false
    };
    this.propertyService.bookViewingOfProperty(this.id, viewing);
  }

  onBookViewingModalClosed(): void {
    this.bookViewingMode = false;
  }

  onCancelViewing(index): void {
    this.propertyService.cancelViewingOfProperty(this.id, index);
  }
}
