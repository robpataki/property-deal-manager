import { ComparableService } from "./comparable.service";
import { Comparable } from '../shared/models/comparable.model';
import { getCurrentTimestamp } from '../shared/utils';
import { NOTE_TYPES } from '../shared/services/app-constants.service';
import { Note } from '../shared/models/note.model';
import { MockUtils } from '../shared/spec/mock-utils';
import { Account } from '../account/account.model';
import { Property } from '../shared/models/property.model';

describe('ComparableService', () => {
  const currentTimestamp: number = new Date(2020, 7, 15, 12, 30).getTime(); // The big day!
  let userAccount: Account;
  let userName: string;

  let comparablesChangedSpy: jasmine.Spy;
  let comparableService: ComparableService;
  
  let comparable1: Comparable;
  let comparable2: Comparable;
  let comparable3: Comparable;
  let comparable4: Comparable;
  let comparable5: Comparable;
  let comparable6: Comparable;
  let comparable7: Comparable;

  let property1: Property;
  let property2: Property;
  let property3: Property;

  beforeEach(() => {
    // Use the same return value for every getCurrentTimestamp() call
    // This also works in the mocks coming from the MockUtils class :)
    spyOn(Date, 'now').and.returnValue(currentTimestamp);

    const mockAccountService = MockUtils.getMockAccountService();
    comparableService = new ComparableService();
    comparablesChangedSpy = spyOn(comparableService.comparablesChanged, 'emit');

    userAccount = mockAccountService.getAccount();
    userName = userAccount.user.public_profile.displayName;

    const mockComparables = MockUtils.getMockComparables();
    comparable1 = mockComparables[0];
    comparable2 = mockComparables[1];
    comparable3 = mockComparables[2];
    comparable4 = mockComparables[3];
    comparable5 = mockComparables[4];
    comparable6 = mockComparables[5];
    comparable7 = mockComparables[6];

    const mockProperties = MockUtils.getMockProperties();
    property1 = mockProperties[0];
    property2 = mockProperties[1];
    property3 = mockProperties[2];
  })

  it('should exist', () => {
    expect(comparableService).toBeTruthy();
  })

  it('#getComparables should by default return an empty array (and not emit change event)', () => {
    expect(comparableService.getComparables()).toEqual([]);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(0);
  })

  it('#setComparables should set the comparables array (and emit change event)', () => {
    const comparables: Comparable[] = [comparable1, comparable2];
    comparableService.setComparables(comparables);
    expect(comparablesChangedSpy).toHaveBeenCalledWith(comparables);
    
    expect(comparableService.comparables).toEqual(comparables);
  })

  it('#getComparables should return an array of comparables (and not emit change event)', () => {
    const comparables: Comparable[] = [comparable1, comparable2];
    comparableService.setComparables(comparables);
    
    expect(comparableService.getComparables()).toEqual(comparables);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(1);
  })

  it('#reset should set the comparables to an empty array (and not emit change event)', () => {
    const comparables: Comparable[] = [comparable1];
    comparableService.setComparables(comparables);
    
    comparableService.reset();
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(1);

    expect(comparableService.getComparables()).toEqual([]);
    expect(comparableService.comparables).toEqual([]);
  })

  it('#addComparable should add a comparable (and emit change event)', () => {
    comparableService.addComparable(comparable1);
    expect(comparablesChangedSpy).toHaveBeenCalledWith([comparable1]);
    expect(comparableService.getComparables()).toEqual([comparable1]);
    
    comparableService.addComparable(comparable2);
    expect(comparablesChangedSpy).toHaveBeenCalledWith([comparable1, comparable2]);
    expect(comparableService.getComparables()).toEqual([comparable1, comparable2]);
  })

  it('#getComparable should return the comparable with matching uid (and not emit change event)', () => {
    const comparables: Comparable[] = [comparable1, comparable2];
    comparableService.setComparables(comparables);

    expect(comparableService.getComparable(comparable1.uid)).toEqual(comparable1);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(1);

    expect(comparableService.getComparable('f_ooBar')).toEqual(undefined);
  })

  it('#deleteComparable should delete the comparable (and emit change event)', () => {
    const comparables: Comparable[] = [comparable1, comparable2, comparable3];
    comparableService.setComparables(comparables);

    expect(comparableService.getComparables().length).toEqual(3);

    comparableService.deleteComparable(comparable2.uid);
    expect(comparablesChangedSpy).toHaveBeenCalledWith([comparable1, comparable3]);
    
    expect(comparableService.getComparables().length).toEqual(2);
    expect(comparableService.getComparables()).toEqual([comparable1, comparable3]);
  })

  it('#setComparable should update an existing comparable (and emit change event)', () => {
    comparableService.setComparables([comparable1]);
    const updatedComparable1 = {
      ...comparable1,
      town: 'Chunky town'
    };

    comparableService.setComparable(comparable1.uid, updatedComparable1);
    expect(comparablesChangedSpy).toHaveBeenCalledWith([comparable1]);

    expect(comparableService.getComparables().length).toEqual(1);
    expect(comparableService.getComparable(comparable1.uid).town).toEqual('Chunky town');
  })

    it('#addNoteToComparable should add a note to the comparable (and emit change event if not called silently) ', () => {
      comparableService.setComparables([comparable1, comparable2]);
      expect(comparableService.getComparable(comparable1.uid).notes.length).toEqual(0);
      
      // Add one loudly
      const firstNote: Note = new Note('This is my first note', getCurrentTimestamp(), NOTE_TYPES.NOT.key, userName);
      comparableService.addNoteToComparable(comparable1.uid, firstNote);
      expect(comparablesChangedSpy).toHaveBeenCalledWith([comparable1, comparable2]);
      expect(comparableService.getComparable(comparable1.uid).notes.length).toEqual(1);
      expect(comparableService.getComparable(comparable1.uid).notes[0].text).toEqual('This is my first note');
      expect(comparablesChangedSpy).toHaveBeenCalledTimes(2);

      // Add one in silence
      const secondNote: Note = new Note('This is my second note', getCurrentTimestamp(), NOTE_TYPES.NOT.key, userName);
      comparableService.addNoteToComparable(comparable1.uid, secondNote, true);
      expect(comparablesChangedSpy).toHaveBeenCalledTimes(2);
      expect(comparableService.getComparable(comparable1.uid).notes.length).toEqual(2);
      expect(comparableService.getComparable(comparable1.uid).notes[1].text).toEqual('This is my second note');
    })

  it('#addPropertyToComparable should add a property once to the given comparable (and emit change event if not called silently)', () => {
    comparableService.setComparables([comparable1]);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([]);
    
    // Add one loudly
    comparableService.addPropertyToComparable(comparable1.uid, property1.uid);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(2);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([property1.uid]);
    
    // Add one in silence
    comparableService.addPropertyToComparable(comparable1.uid, property2.uid, true);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(2);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([property1.uid, property2.uid]);

    // Don't do dupes
    comparableService.addPropertyToComparable(comparable1.uid, property1.uid);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([property1.uid, property2.uid]);
  });

  it('#removePropertyFromComparable should remove the given property from the comparable (and emit change event if not called silently)', () => {
    comparableService.setComparables([comparable1]);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(1);
    comparableService.addPropertyToComparable(comparable1.uid, property1.uid, true);
    comparableService.addPropertyToComparable(comparable1.uid, property2.uid, true);
    comparableService.addPropertyToComparable(comparable1.uid, property3.uid, true);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([property1.uid, property2.uid, property3.uid]);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(1);

    // Remove one loudly
    comparableService.removePropertyFromComparable(comparable1.uid, property2.uid);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([property1.uid, property3.uid]);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(2);

    // Remove one in silence
    comparableService.removePropertyFromComparable(comparable1.uid, property1.uid, true);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([property3.uid]);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(2);
  });

  it('#getComparablesOfProperty should return a list of comparables of a given property', () => {
    comparableService.setComparables([comparable1, comparable2, comparable3]);
  
    comparableService.addPropertyToComparable(comparable1.uid, property1.uid, true);
    comparableService.addPropertyToComparable(comparable1.uid, property2.uid, true);
    
    comparableService.addPropertyToComparable(comparable2.uid, property2.uid, true);
    comparableService.addPropertyToComparable(comparable2.uid, property3.uid, true);
    
    comparableService.addPropertyToComparable(comparable3.uid, property1.uid, true);
    comparableService.addPropertyToComparable(comparable3.uid, property3.uid, true);
    
    const comparablesOfProperty1: Comparable[] = comparableService.getComparablesOfProperty(property1.uid);
    const comparablesOfProperty2: Comparable[] = comparableService.getComparablesOfProperty(property2.uid);
    const comparablesOfProperty3: Comparable[] = comparableService.getComparablesOfProperty(property3.uid);
    
    expect(comparablesOfProperty1).toEqual([comparable1, comparable3]);
    expect(comparablesOfProperty2).toEqual([comparable1, comparable2]);
    expect(comparablesOfProperty3).toEqual([comparable2, comparable3]);
  });

  it('#deleteProperty should remove the property from every comparable (and emit change event if not called silently)', () => {
    comparableService.setComparables([comparable1, comparable2, comparable3]);
    comparableService.addPropertyToComparable(comparable1.uid, property1.uid, true);
    comparableService.addPropertyToComparable(comparable1.uid, property2.uid, true);
    comparableService.addPropertyToComparable(comparable1.uid, property3.uid, true);
    comparableService.addPropertyToComparable(comparable2.uid, property2.uid, true);
    comparableService.addPropertyToComparable(comparable2.uid, property3.uid, true);
    comparableService.addPropertyToComparable(comparable3.uid, property1.uid, true);
    comparableService.addPropertyToComparable(comparable3.uid, property3.uid, true);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([property1.uid, property2.uid, property3.uid]);
    expect(comparableService.getComparable(comparable2.uid).properties).toEqual([property2.uid, property3.uid]);
    expect(comparableService.getComparable(comparable3.uid).properties).toEqual([property1.uid, property3.uid]);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(1);

    // Remove one loudly
    comparableService.deleteProperty(property2.uid);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(2);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([property1.uid, property3.uid]);
    expect(comparableService.getComparable(comparable2.uid).properties).toEqual([property3.uid]);
    expect(comparableService.getComparable(comparable3.uid).properties).toEqual([property1.uid, property3.uid]);

    // Remove one in silence
    comparableService.deleteProperty(property3.uid, true);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(2);
    expect(comparableService.getComparable(comparable1.uid).properties).toEqual([property1.uid]);
    expect(comparableService.getComparable(comparable2.uid).properties).toEqual([]);
    expect(comparableService.getComparable(comparable3.uid).properties).toEqual([property1.uid]);
  });

  it('#deleteProperty should only emit the change event if anything was deleted, and not called silently', () => {
    comparableService.deleteProperty(property1.uid);
    comparableService.deleteProperty(property2.uid, true);
    expect(comparablesChangedSpy).toHaveBeenCalledTimes(0);
  });

  it('#getComparablesByPostcode should return a list of comparables, with matching postcode - ordered ascending by postcode', () => {
    comparableService.setComparables([comparable1, comparable2, comparable3, comparable4, comparable5, comparable6, comparable7])
    expect(comparableService.getComparablesByPostcode('M')).toEqual([comparable5, comparable4]);
    expect(comparableService.getComparablesByPostcode('M21')).toEqual([comparable4]);
    expect(comparableService.getComparablesByPostcode('M21 0UB')).toEqual([comparable4]);
    expect(comparableService.getComparablesByPostcode('OL')).toEqual([comparable7, comparable6]);
    expect(comparableService.getComparablesByPostcode('OL8')).toEqual([comparable6]);

    expect(comparableService.getComparablesByPostcode('m')).toEqual([comparable5, comparable4]);
    expect(comparableService.getComparablesByPostcode('ol')).toEqual([comparable7, comparable6]);
  });

  it('#emitChanges should emit `comparablesChanged`', () => {
    comparableService.emitChanges();
    expect(comparablesChangedSpy).toHaveBeenCalledWith([]);
  });
});
