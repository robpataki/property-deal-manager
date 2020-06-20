import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { format as formatDate } from 'date-fns';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Comparable } from 'src/app/shared/models/comparable.model';
import { Note } from 'src/app/shared/models/note.model';
import { getCurrentTimestamp, sortArrayByKey } from 'src/app/shared/utils';
import { ComparableService } from '../comparable.service';
import { AccountService } from 'src/app/account/account.service';
import { NOTE_TYPES, PROPERTY_TYPES, STRATEGIES } from 'src/app/shared/services/app-constants.service';
import { ToDateTimePipe } from 'src/app/shared/pipes/to-date-time.pipe';
import { TimeFromNowPipe } from 'src/app/shared/pipes/time-from-now.pipe';
import { Property } from 'src/app/shared/models/property.model';
import { PropertyService } from 'src/app/properties/property.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { AddNoteModalComponent } from 'src/app/modals/add-note-modal/add-note-modal.component';

@Component({
  selector: 'app-comparable',
  templateUrl: './comparable.component.html'
})
export class ComparableComponent implements OnInit, OnDestroy {
  @ViewChild(AddNoteModalComponent, {static: false}) addNoteModal: AddNoteModalComponent;
  @ViewChild('notesFilter', {static: false}) notesFilter: ElementRef<HTMLInputElement>;

  id: string;
  propertyId: string;
  property: Property;
  properties: Property[];
  sortedProperties: Property[];
  comparable: Comparable;
  backButtonLabel: string;
  backButtonUrl: string;

  comparablesChangedSub: Subscription;
  
  notes: Note[];
  sortedNotes: Note[];
  filteredNotes: Note[];
  filterNotesToPropertyId: boolean;
  soldDate: string;
  soldFor: string;
  
  addNoteMode: boolean;
  propertyTypes: any = PROPERTY_TYPES;
  noteTypes: any = NOTE_TYPES;
  strategies: any = STRATEGIES;

  maxNotesToShow: number = 5;

  constructor(private accountService: AccountService,
              private dataStorageService: DataStorageService,
              private comparableService: ComparableService,
              private propertyService: PropertyService,
              private route: ActivatedRoute,
              private router: Router,
              private toDateTimePipe: ToDateTimePipe,
              private timeFromNowPipe: TimeFromNowPipe) {}

  ngOnInit(): void {
    this.setUpBackButton();

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.initComparable();
      }
    );

    this.route.queryParams.subscribe(params => {
      this.propertyId = params['propertyId'];
      this.property = this.propertyService.getProperty(this.propertyId);
      this.filterNotesToPropertyId = true;
      this.initComparable();
      this.setUpBackButton();
    });

    this.comparablesChangedSub = this.comparableService.comparablesChanged.subscribe(comparables => {
      this.initComparable();

      this.dataStorageService.storeComparable(this.id).then(() => {
        if (this.addNoteMode) {
          this.addNoteModal.onComplete();
        }
      }, error => {
        console.error('There was an error when trying to update the comparable - error message: ', error);
      });
    });
  }

  ngOnDestroy(): void {
    this.comparablesChangedSub.unsubscribe();
  }

  setUpBackButton(): void {
    this.backButtonLabel = !!this.propertyId ? 'Back to property card' : 'Back to comparables';
    this.backButtonUrl = !!this.propertyId ? `/properties/${this.propertyId}#s-comparables` : `/comparables`;
  }

  initComparable(): void {
    this.comparable = this.comparableService.getComparable(this.id);
    if (!this.comparable) {
      this.router.navigate(['/not-found']);
      return;
    }
    this.getPropertyData();
  }

  getPropertyData(): void {
    this.soldDate = this.toDateTimePipe.transform(this.comparable.soldTimestamp);
    this.soldFor = this.timeFromNowPipe.transform(this.comparable.soldTimestamp);

    this.notes = this.getNotes();
    this.sortedNotes = sortArrayByKey('timestamp', this.notes).reverse();
    this.filteredNotes = this.getFilteredNotes(this.sortedNotes);

    this.properties = this.getProperties();
    this.sortedProperties = sortArrayByKey('createTimestamp', this.properties).reverse();
  }

  // Return array of date DESC notes
  getNotes(): Note[] {
    if (!this.comparable.notes || !this.comparable.notes.length) {
      return [];
    }

    return this.comparable.notes.map((note) => {
      const formattedDate = formatDate(new Date(+note.timestamp), 'dd/MM/yyyy HH:mm:ss');

      return {
        date: formattedDate,
        timestamp: note.timestamp,
        type: NOTE_TYPES[note.type].key,
        propertyId: note.propertyId || null,
        rawType: note.type,
        text: note.text,
        userName: note.userName
      };
    });
  }

  getFilteredNotes(notes: Note[]): Note[] {
    if (!!this.filterNotesToPropertyId && !!this.propertyId) {
      return notes.filter((note) => {
        if (note.propertyId === this.propertyId) {
          return note;
        }
      })
    } else {
      return notes;
    }
  }

  getProperties(): Property[] {
    if (!this.comparable.properties || !this.comparable.properties.length) {
      return [];
    }

    return this.comparable.properties.map((propertyId) => {
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
    
    if (!!this.propertyId) {
      newNote.propertyId = this.propertyId;
    }
    this.comparableService.addNoteToComparable(this.id, newNote);
  }

  onAddNoteModalClosed(): void {
    this.addNoteMode = false;
  }

  onNotesFilterChange(): void {
    this.filterNotesToPropertyId = this.notesFilter.nativeElement.value === 'true' ? true : false;
    this.filteredNotes = this.getFilteredNotes(this.sortedNotes);
  }
}