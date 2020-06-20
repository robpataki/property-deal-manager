import { MockUtils } from '../shared/spec/mock-utils';
import { PropertyService } from "./property.service";
import { Property, PropertyDetails } from '../shared/models/property.model';
import { Comparable } from '../shared/models/comparable.model';
import { Account } from '../account/account.model';
import { Note } from '../shared/models/note.model';
import { getCurrentTimestamp } from '../shared/utils';
import { NOTE_TYPES } from '../shared/services/app-constants.service';
import { Offer } from '../shared/models/offer.model';
import { Viewing } from '../shared/models/viewing.model';

describe('PropertyService', () => {
  const currentTimestamp: number = new Date(2020, 7, 15, 12, 30).getTime(); // The big day!
  let userAccount: Account;
  let userName: string;

  let propertiesChangedSubSpy: jasmine.Spy;
  let propertyService: PropertyService;
  
  let property1: Property;
  let property2: Property;
  let property3: Property;
  
  let comparable1: Comparable;
  let comparable2: Comparable;
  let comparable3: Comparable;

  beforeEach(() => {
    // Use the same return value for every getCurrentTimestamp() call
    // This also works in the mocks coming from the MockUtils class :)
    spyOn(Date, 'now').and.returnValue(currentTimestamp);

    const mockAccountService = MockUtils.getMockAccountService();
    propertyService = new PropertyService(mockAccountService);
    propertiesChangedSubSpy = spyOn(propertyService.propertiesChangedSub, 'next');

    userAccount = mockAccountService.getAccount();
    userName = userAccount.user.public_profile.displayName;

    const mockProperties: Property[] = MockUtils.getMockProperties();
    property1 = mockProperties[0];
    property2 = mockProperties[1];
    property3 = mockProperties[2];

    const mockComparables: Comparable[] = MockUtils.getMockComparables();
    comparable1 = mockComparables[0];
    comparable2 = mockComparables[1];
    comparable3 = mockComparables[2];
  })

  it('should exist', () => {
    expect(propertyService).toBeTruthy();
  })

  it('#getProperties should by default return an empty array (and not emit change event)', () => {
    expect(propertyService.getProperties()).toEqual([]);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(0);
  })

  it('#setProperties should set the properties array (and emit change event)', () => {
    const properties: Property[] = [property1, property2];
    propertyService.setProperties(properties);
    expect(propertiesChangedSubSpy).toHaveBeenCalledWith(properties);
    
    expect(propertyService.properties).toEqual(properties);
  })

  it('#getProperties should return an array of properties (and not emit change event)', () => {
    const properties: Property[] = [property1, property2];
    propertyService.setProperties(properties);
    
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(1);
    expect(propertyService.getProperties()).toEqual(properties);
  })

  it('#reset should set the properties to an empty array (and not emit change event)', () => {
    const properties: Property[] = [property1, property2];
    propertyService.setProperties(properties);
    
    propertyService.reset();
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);

    expect(propertyService.getProperties()).toEqual([]);
    expect(propertyService.properties).toEqual([]);
  })

  it('#addProperty should add a property (and emit change event)', () => {
    propertyService.addProperty(property1);
    expect(propertiesChangedSubSpy).toHaveBeenCalledWith([property1]);
    expect(propertyService.getProperties()).toEqual([property1]);
    
    propertyService.addProperty(property2);
    expect(propertiesChangedSubSpy).toHaveBeenCalledWith([property1, property2]);
    expect(propertyService.getProperties()).toEqual([property1, property2]);
  })

  it('#getProperty should return the comparable with matching uid (and not emit change event)', () => {
    const properties: Property[] = [property1, property2];
    propertyService.setProperties(properties);

    expect(propertyService.getProperty(property1.uid)).toEqual(property1);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(1);

    expect(propertyService.getProperty('f_ooBar')).toEqual(undefined);
  })

  it('#deleteProperty should delete the property (and emit change event)', () => {
    const properties: Property[] = [property1, property2, property3];
    propertyService.setProperties(properties);

    expect(propertyService.getProperties().length).toEqual(3);

    propertyService.deleteProperty(property2.uid);
    expect(propertiesChangedSubSpy).toHaveBeenCalledWith([property1, property3]);
    
    expect(propertyService.getProperties().length).toEqual(2);
    expect(propertyService.getProperties()).toEqual([property1, property3]);
  })

  it('#updatePropertyDetails should update the basic details of an existing property (and emit change event)', () => {
    propertyService.setProperties([property1]);

    const updatedProperty1Details: PropertyDetails = {
      ...property1,
      town: 'Funky town'
    };

    propertyService.updatePropertyDetails(updatedProperty1Details);
    expect(propertiesChangedSubSpy).toHaveBeenCalledWith([property1]);

    expect(propertyService.getProperties().length).toEqual(1);
    expect(propertyService.getProperty(property1.uid).town).toEqual('Funky town');
  })

  it('#addNoteToProperty should add a note to the property (and emit change event if not called silently) ', () => {
    propertyService.setProperties([property1, property2]);
    expect(propertyService.getProperty(property1.uid).notes.length).toEqual(1);
    expect(propertyService.getProperty(property1.uid).notes[0].text).toEqual('Property card created');
    
    // Add one loudly
    const firstNote: Note = new Note('This is my first note', getCurrentTimestamp(), NOTE_TYPES.NOT.key, userName);
    propertyService.addNoteToProperty(property1.uid, firstNote);
    expect(propertiesChangedSubSpy).toHaveBeenCalledWith([property1, property2]);
    expect(propertyService.getProperty(property1.uid).notes.length).toEqual(2);
    expect(propertyService.getProperty(property1.uid).notes[1].text).toEqual('This is my first note');
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);

    // Add one in silence
    const secondNote: Note = new Note('This is my second note', getCurrentTimestamp(), NOTE_TYPES.NOT.key, userName);
    propertyService.addNoteToProperty(property1.uid, secondNote, true);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
    expect(propertyService.getProperty(property1.uid).notes.length).toEqual(3);
    expect(propertyService.getProperty(property1.uid).notes[2].text).toEqual('This is my second note');
  })

  it('#addComparableToProperty should add a comparable once to the given property (and emit change event if not called silently)', () => {
    propertyService.setProperties([property1]);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([]);
    
    // Add one loudly
    propertyService.addComparableToProperty(property1.uid, comparable1.uid);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([comparable1.uid]);
    
    // Add one in silence
    propertyService.addComparableToProperty(property1.uid, comparable2.uid, true);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([comparable1.uid, comparable2.uid]);

    // Don't do dupes
    propertyService.addComparableToProperty(property1.uid, comparable1.uid);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([comparable1.uid, comparable2.uid]);
  });

  it('#removeComparableFromProperty should remove the given comparable from the property (and emit change event if not called silently)', () => {
    propertyService.setProperties([property1]);
    propertyService.addComparableToProperty(property1.uid, comparable1.uid);
    propertyService.addComparableToProperty(property1.uid, comparable2.uid);
    propertyService.addComparableToProperty(property1.uid, comparable3.uid);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([comparable1.uid, comparable2.uid, comparable3.uid]);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(4);

    // Remove one loudly
    propertyService.removeComparableFromProperty(property1.uid, comparable2.uid);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(5);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([comparable1.uid, comparable3.uid]);

    // Remove one in silence
    propertyService.removeComparableFromProperty(property1.uid, comparable3.uid, true);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(5);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([comparable1.uid]);
  });

  it('#getPropertiesOfComparable should return a list of properties the comparable is linked to', () => {
    propertyService.setProperties([property1, property2, property3]);
    propertyService.addComparableToProperty(property1.uid, comparable1.uid);
    propertyService.addComparableToProperty(property2.uid, comparable2.uid);
    propertyService.addComparableToProperty(property3.uid, comparable1.uid);
    propertyService.addComparableToProperty(property3.uid, comparable2.uid);

    expect(propertyService.getPropertiesOfComparable(comparable1.uid)).toEqual([property1, property3]);
    expect(propertyService.getPropertiesOfComparable(comparable2.uid)).toEqual([property2, property3]);
  });

  it('#deleteComparable should remove the given comparable from every property (and emit change event if not called silently)', () => {
    propertyService.setProperties([property1, property2, property3]);
    propertyService.addComparableToProperty(property1.uid, comparable1.uid, true);
    propertyService.addComparableToProperty(property1.uid, comparable2.uid, true);
    propertyService.addComparableToProperty(property1.uid, comparable3.uid, true);
    propertyService.addComparableToProperty(property2.uid, comparable2.uid, true);
    propertyService.addComparableToProperty(property2.uid, comparable3.uid, true);
    propertyService.addComparableToProperty(property3.uid, comparable1.uid, true);
    propertyService.addComparableToProperty(property3.uid, comparable3.uid, true);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([comparable1.uid, comparable2.uid, comparable3.uid]);
    expect(propertyService.getProperty(property2.uid).comparables).toEqual([comparable2.uid, comparable3.uid]);
    expect(propertyService.getProperty(property3.uid).comparables).toEqual([comparable1.uid, comparable3.uid]);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(1);

    // Remove one loudly
    propertyService.deleteComparable(comparable2.uid);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([comparable1.uid, comparable3.uid]);
    expect(propertyService.getProperty(property2.uid).comparables).toEqual([comparable3.uid]);
    expect(propertyService.getProperty(property3.uid).comparables).toEqual([comparable1.uid, comparable3.uid]);

    // Remove one in silence
    propertyService.deleteComparable(comparable3.uid, true);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
    expect(propertyService.getProperty(property1.uid).comparables).toEqual([comparable1.uid]);
    expect(propertyService.getProperty(property2.uid).comparables).toEqual([]);
    expect(propertyService.getProperty(property3.uid).comparables).toEqual([comparable1.uid]);
  });

  it('#deleteComparable should only emit the change event if anything was deleted, and not called silently', () => {
    propertyService.deleteComparable(comparable1.uid);
    propertyService.deleteComparable(comparable2.uid, true);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(0);
  });

  it('#getPropertiesByPostcode should return a list of properties with matching postcode', () => {
    propertyService.setProperties([property1, property2, property3])
    expect(propertyService.getPropertiesByPostcode('M')).toEqual([property1]);
    expect(propertyService.getPropertiesByPostcode('E1')).toEqual([property2, property3]);
    expect(propertyService.getPropertiesByPostcode('E1 5LJ')).toEqual([property3]);
  });

  it('#makeOfferOnProperty should add an offer to the property (and emit change event if not called silently)', () => {
    propertyService.setProperties([property1]);
    expect(propertyService.getProperty(property1.uid).offers).toEqual([]);
    
    // Add one loudly
    const offer1: Offer = new Offer(10000, +getCurrentTimestamp(), userName);
    propertyService.makeOfferOnProperty(property1.uid, offer1);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
    expect(propertyService.getProperty(property1.uid).offers).toEqual([offer1]);
    
    // Add one in silence
    const offer2: Offer = new Offer(10500, +getCurrentTimestamp(), userName);
    propertyService.makeOfferOnProperty(property1.uid, offer2, true);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
    expect(propertyService.getProperty(property1.uid).offers).toEqual([offer1, offer2]);
  });

  it('#bookViewingOfProperty should add a viewing to the property (and emit change event if not called silently)', () => {
    propertyService.setProperties([property1]);
    expect(propertyService.getProperty(property1.uid).viewings).toEqual([]);
    
    // Add one loudly
    const viewing1: Viewing = new Viewing(98765);
    propertyService.bookViewingOfProperty(property1.uid, viewing1);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
    expect(propertyService.getProperty(property1.uid).viewings).toEqual([viewing1]);
    
    // Add one in silence
    const viewing2: Viewing = new Viewing(12345);
    propertyService.bookViewingOfProperty(property1.uid, viewing2, true);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
    expect(propertyService.getProperty(property1.uid).viewings).toEqual([viewing1, viewing2]);
  });

  it('#cancelViewingOfProperty should cancel a viewing of the property (and emit change event)', () => {
    propertyService.setProperties([property1]);
    const viewing: Viewing = new Viewing(getCurrentTimestamp());
    propertyService.bookViewingOfProperty(property1.uid, viewing);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);

    expect(propertyService.getProperty(property1.uid).viewings[0].cancelled).toBeFalsy();
    propertyService.cancelViewingOfProperty(property1.uid, 0);
    expect(propertyService.getProperty(property1.uid).viewings[0].cancelled).toBeTrue();
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(3);
  });

  it('#updateCrunch should update the property crunch (and emit change event)', () => {
    propertyService.setProperties([property1]);
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(1);
    expect(propertyService.getProperty(property1.uid).crunch).toEqual({ strg: 'BTL' });

    propertyService.updatePropertyCrunch(property1.uid, { strg: 'FLP' });
    expect(propertiesChangedSubSpy).toHaveBeenCalledTimes(2);
  });

  it('#emitChanges should emit `comparablesChanged`', () => {
    propertyService.emitChanges();
    expect(propertiesChangedSubSpy).toHaveBeenCalledWith([]);
  });

  it('#getUserName should return logged in user\'s displayName', () => {
    expect(propertyService.getUserName()).toEqual(userName);
  });
});
