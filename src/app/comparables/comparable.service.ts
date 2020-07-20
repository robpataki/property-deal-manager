import { Injectable, EventEmitter } from '@angular/core';
import { Comparable } from '../shared/models/comparable.model';
import { Note } from '../shared/models/note.model';

@Injectable()
export class ComparableService {
  comparables: Comparable[] = [];
  comparablesChanged: EventEmitter<Comparable[]> = new EventEmitter<Comparable[]>();

  constructor() {};

  getComparables(): Comparable[] {
    return this.comparables.slice(0);
  }

  setComparables(comparables: Comparable[]): void {
    this.comparables = comparables;
    this.emitChanges();
  }

  addComparable(comparable: Comparable): void {
    this.comparables.push(comparable);
    this.emitChanges();
  }

  getComparable(uid: string): Comparable {
    return this.comparables.find((comparable) => {
      return comparable.uid === uid;
    });
  }

  setComparable(uid: string, comparable: Comparable): void {
    let index: number = this.comparables.findIndex((comparable) => {
      return comparable.uid === uid;
    });

    if (index >= 0) {
      this.comparables[index] = comparable;
      this.emitChanges();
    }
  }

  deleteComparable(uid: string): void {
    let index: number = this.comparables.findIndex((comparable) => {
      return comparable.uid == uid;
    });

    if (index >= 0) {
      this.comparables.splice(index, 1);
      this.emitChanges();
    }
  }

  addNoteToComparable(comparableId: string, note: Note, keepSilent?: boolean): void {
    const comparable: Comparable = this.getComparable(comparableId);
    comparable.notes.push(note);

    if (!keepSilent) {
      this.emitChanges();
    }
  }

  addPropertyToComparable(comparableId: string, propertyId: string, keepSilent?: boolean) {
    const comparable: Comparable = this.getComparable(comparableId);

    if (!comparable.properties.includes(propertyId)) {
      comparable.properties.push(propertyId);
    }

    if (!keepSilent) {
      this.emitChanges();
    }
  }

  removePropertyFromComparable(comparableId: string, propertyId: string, keepSilent?: boolean) {
    const comparable: Comparable = this.getComparable(comparableId);

    let index: number = comparable.properties.findIndex((property) => {
      return property === propertyId;
    });

    if (index >= 0) {
      comparable.properties.splice(index, 1);

      if (!keepSilent) {
        this.emitChanges();
      }
    }
  }

  deleteProperty(propertyId: string, keepSilent?: boolean): void {
    let deletionPerformed: boolean = false;
    this.comparables.map(comparable => {
      const index = comparable.properties.indexOf(propertyId);
      if (index >= 0) {
        deletionPerformed = true;
        comparable.properties.splice(index, 1);
      }
    });

    if (deletionPerformed && !keepSilent) {
      this.emitChanges();
    }
  }

  getComparablesOfProperty(propertyId: string): Comparable[] {
    return this.comparables.filter(comparable => {
      if (comparable.properties.includes(propertyId)) {
        return comparable;
      }
    });
  }

  getComparablesByPostcode(postcode: string): Comparable[] {
    return this.comparables.filter(comparable => {
      if (comparable.postcode.toUpperCase().substr(0, postcode.length) === postcode.toUpperCase()) {
        return comparable;
      }
    }).sort((a, b) => {
      return a.postcode > b.postcode ? 1 : -1;
    });
  }

  reset(): void {
    this.comparables = [];
  }

  emitChanges(): void {
    this.comparablesChanged.emit(this.comparables.slice());
  }
}
