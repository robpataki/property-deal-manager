import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { format as formatDate } from 'date-fns';

import { Property } from 'src/app/shared/models/property.model';
import { PropertyService } from '../property.service';
import { PROPERTY_TYPES, DEAL_TYPES, NOTE_TYPES, EPC_RATINGS, STRATEGIES } from '../../shared/services/app-constants.service';
import { AccountService } from 'src/app/account/account.service';

import { Note } from 'src/app/shared/models/note.model';
import { AddNoteModalComponent } from 'src/app/modals/add-note-modal/add-note-modal.component';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { OfferRaw, MakeOfferModalComponent } from 'src/app/modals/make-offer-modal/make-offer-modal.component';
import { getCurrentTimestamp, sortArrayByKey, ukDateToUSDate } from '../../shared/utils';
import { Offer } from '../../shared/models/offer.model';
import { CurrencyPipe } from '../../shared/pipes/currency.pipe';
import { ToDateTimePipe } from '../../shared/pipes/to-date-time.pipe';
import { BookingRaw, BookViewingModalComponent } from 'src/app/modals/book-viewing-modal/book-viewing-modal.component';
import { Viewing } from 'src/app/shared/models/viewing.model';
import { TimeFromNowPipe } from 'src/app/shared/pipes/time-from-now.pipe';
import { ConfirmActionModalComponent } from 'src/app/modals/confirm-action-modal/confirm-action-modal.component';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';
import { ComparableService } from 'src/app/comparables/comparable.service';
import { Comparable } from 'src/app/shared/models/comparable.model';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html'
})
export class PropertyComponent implements OnInit, OnDestroy {
  @ViewChild(AddNoteModalComponent, {static: false}) addNoteModal: AddNoteModalComponent;
  @ViewChild(MakeOfferModalComponent, {static: false}) makeOfferModal: MakeOfferModalComponent;
  @ViewChild(BookViewingModalComponent, {static: false}) bookViewingModal: BookViewingModalComponent;

  @ViewChild(PlaceholderDirective, {static: false}) confirmModalHost: PlaceholderDirective;
  confirmationModalCancelSub: Subscription;
  confirmationModalConfirmSub: Subscription;
  actionConfirmModalComponentRef: ComponentRef<any>;

  propertiesChangedSub: Subscription;
  
  property: Property;
  comparables: Comparable[];
  
  id: string;
  notes: Note[];
  sortedNotes: Note[];
  offers: Offer[];
  sortedOffers: Offer[];
  sortedComparables: Comparable[];
  comparableToRemove: Comparable;
  viewings: Viewing[];
  sortedViewings: Viewing[];
  hasUpcomingViewing: boolean;
  marketDate: string;
  doneViewing: boolean;
  marketedFor: string;
  
  addNoteMode: boolean;
  bookViewingMode: boolean;
  makeOfferMode: boolean;
  removeComparableMode: boolean;
  isLoading: boolean;

  propertyTypes: any = PROPERTY_TYPES;
  dealTypes: any = DEAL_TYPES;
  noteTypes: any = NOTE_TYPES;
  strategies: any = STRATEGIES;

  maxNotesToShow: number = 5;
  MAX_LINKS: number = 4;

  constructor(private dataStorageService: DataStorageService,
              private propertyService: PropertyService,
              private comparableService: ComparableService,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private currencyPipe: CurrencyPipe,
              private toDateTimePipe: ToDateTimePipe,
              private timeFromNowPipe: TimeFromNowPipe,
              private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.initProperty();
      }
    );

    this.propertiesChangedSub = this.propertyService.propertiesChangedSub.subscribe(properties => {
      this.initProperty();

      this.dataStorageService.storeProperty(this.id).then(() => {
        if (this.addNoteMode) {
          this.addNoteModal.onComplete();
        }

        if (this.makeOfferMode) {
          this.makeOfferModal.onComplete();
        }

        if (this.bookViewingMode) {
          this.bookViewingModal.onComplete();
        }

        if (this.removeComparableMode) {
          this.dataStorageService.storeComparable(this.comparableToRemove.uid).then(() => {
              this.isLoading = false;
              this.removeComparableMode = false;
              this.comparableToRemove = null;
            }, error => {
              console.error('There was an error when trying to remove the complarable from the property - error message: ', error);
            });
        }
      }, error => {
        console.error('There was an error when trying to update the property - error message: ', error);
      });
    });
  }

  initProperty(): void {
    this.property = this.propertyService.getProperty(this.id);
    if (!this.property) {
      this.router.navigate(['/not-found']);
      return;
    }
    
    this.comparables = this.comparableService.getComparablesOfProperty(this.id);
    this.getPropertyData();
  }

  isUpcomingTime(timestamp: number) {
    return timestamp > getCurrentTimestamp();
  }

  getPropertyData(): void {
    this.marketDate = this.toDateTimePipe.transform(this.property.marketTimestamp);
    this.marketedFor = this.timeFromNowPipe.transform(this.property.marketTimestamp);

    this.notes = this.getNotes();
    this.sortedNotes = sortArrayByKey('timestamp', this.notes).reverse();

    this.viewings = this.getViewings();
    this.sortedViewings = sortArrayByKey('timestamp', this.viewings).reverse();

    this.offers = this.getOffers();
    this.sortedOffers = sortArrayByKey('timestamp', this.offers).reverse();

    this.sortedComparables = sortArrayByKey('soldTimestamp', this.comparables).reverse();

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
    const timestamp: number = getCurrentTimestamp();

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
    const timestamp: number = getCurrentTimestamp();
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
      timestamp: viewingTimestamp,
      cancelled: false
    };
    this.propertyService.bookViewingOfProperty(this.id, viewing);
  }

  onBookViewingModalClosed(): void {
    this.bookViewingMode = false;
  }

  onCancelViewing(index: number): void {
    this.showConfirmationModal('cancel this viewing').then(() => {
      this.propertyService.cancelViewingOfProperty(this.id, index);
    }, error => {});
  }

  onRemoveComparable(index: number): void {
    this.comparableToRemove = this.comparables[index];
    const message: string = 'remove this comparable from this property';
    const additionalMessage: string = 'Please note this won\'t delete the comparable, nor will it remove it from other properties'
    this.showConfirmationModal(message, additionalMessage).then(() => {
     this.removeComparable(this.comparableToRemove.uid);
    }, error => {});
  }

  removeComparable(comparableId: string) {
    this.isLoading = true;
    this.removeComparableMode = true;
    this.comparableService.removePropertyFromComparable(comparableId, this.id, true);
    this.propertyService.removeComparableFromProperty(this.id, comparableId);
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

  ngOnDestroy(): void {
    this.propertiesChangedSub.unsubscribe();

    if (this.actionConfirmModalComponentRef) {
      this.actionConfirmModalComponentRef.destroy(); 
      this.confirmationModalConfirmSub.unsubscribe();
      this.confirmationModalCancelSub.unsubscribe();
    }
  }
}
