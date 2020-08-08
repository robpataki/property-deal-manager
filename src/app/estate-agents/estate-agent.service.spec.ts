import { EstateAgentService } from "./estate-agent.service";
import { EstateAgent } from '../shared/models/estate-agent.model';
import { getCurrentTimestamp } from '../shared/utils';
import { NOTE_TYPES } from '../shared/services/app-constants.service';
import { Note } from '../shared/models/note.model';
import { MockUtils } from '../shared/spec/mock-utils';
import { Account } from '../account/account.model';
import { Person } from '../shared/models/person.model';
import { Property } from '../shared/models/property.model';

describe('EstateAgentService', () => {
  const currentTimestamp: number = new Date(2020, 7, 15, 12, 30).getTime(); // The big day!
  let userAccount: Account;
  let userName: string;

  let estateAgentsChangedSpy: jasmine.Spy;
  let estateAgentService: EstateAgentService;

  let estateAgent1: EstateAgent;
  let estateAgent2: EstateAgent;
  let estateAgent3: EstateAgent;
  let estateAgent4: EstateAgent;

  let property1: Property;
  let property2: Property;
  let property3: Property;

  let negotiator1: Person;
  let negotiator2: Person;

  beforeEach(() => {
    // Use the same return value for every getCurrentTimestamp() call
    // This also works in the mocks coming from the MockUtils class :)
    spyOn(Date, 'now').and.returnValue(currentTimestamp);

    const mockAccountService = MockUtils.getMockAccountService();
    estateAgentService = new EstateAgentService();
    estateAgentsChangedSpy = spyOn(estateAgentService.estateAgentsChanged, 'emit');

    userAccount = mockAccountService.getAccount();
    userName = userAccount.user.public_profile.displayName;

    const mockEstateAgents = MockUtils.getMockEstateAgents();
    estateAgent1 = mockEstateAgents[0];
    estateAgent2 = mockEstateAgents[1];
    estateAgent3 = mockEstateAgents[2];
    estateAgent4 = mockEstateAgents[3];

    const mockProperties = MockUtils.getMockProperties();
    property1 = mockProperties[0];
    property2 = mockProperties[1];
    property3 = mockProperties[2];

    const mockNegotiators = MockUtils.getMockNegotiators();
    negotiator1 = mockNegotiators[0];
    negotiator2 = mockNegotiators[1];
  })

  it('should exist', () => {
    expect(estateAgentService).toBeTruthy();
  })

  it('#getEstateAgents should by default return an empty array (and not emit change event)', () => {
    expect(estateAgentService.getEstateAgents()).toEqual([]);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(0);
  })

  it('#setEstateAgents should set the estateAgents array (and emit change event)', () => {
    const estateAgents: EstateAgent[] = [estateAgent1, estateAgent2];
    estateAgentService.setEstateAgents(estateAgents);
    expect(estateAgentsChangedSpy).toHaveBeenCalledWith(estateAgents);

    expect(estateAgentService.estateAgents).toEqual(estateAgents);
  })

  it('#getEstateAgents should return an array of estate agents (and not emit change event)', () => {
    const estateAgents: EstateAgent[] = [estateAgent1, estateAgent2];
    estateAgentService.setEstateAgents(estateAgents);

    expect(estateAgentService.getEstateAgents()).toEqual(estateAgents);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(1);
  })

 it('#reset should set the estateAgents array to an empty array (and not emit change event)', () => {
    const estateAgents: EstateAgent[] = [estateAgent1];
    estateAgentService.setEstateAgents(estateAgents);

    estateAgentService.reset();
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(1);

    expect(estateAgentService.getEstateAgents()).toEqual([]);
    expect(estateAgentService.estateAgents).toEqual([]);
  })

  it('#addEstateAgent should add an estate agent (and emit change event)', () => {
    estateAgentService.addEstateAgent(estateAgent1);
    expect(estateAgentsChangedSpy).toHaveBeenCalledWith([estateAgent1]);
    expect(estateAgentService.getEstateAgents()).toEqual([estateAgent1]);

    estateAgentService.addEstateAgent(estateAgent2);
    expect(estateAgentsChangedSpy).toHaveBeenCalledWith([estateAgent1, estateAgent2]);
    expect(estateAgentService.getEstateAgents()).toEqual([estateAgent1, estateAgent2]);
  })

  it('#getEstateAgent should return the estate agent with matching uid (and not emit change event)', () => {
    const estateAgents: EstateAgent[] = [estateAgent1, estateAgent2];
    estateAgentService.setEstateAgents(estateAgents);

    expect(estateAgentService.getEstateAgent(estateAgent1.uid)).toEqual(estateAgent1);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(1);

    expect(estateAgentService.getEstateAgent('f_ooBar')).toEqual(undefined);
  })

  it('#deleteEstateAgent should delete the estate agent (and emit change event)', () => {
    const estateAgents: EstateAgent[] = [estateAgent1, estateAgent2, estateAgent3];
    estateAgentService.setEstateAgents(estateAgents);

    expect(estateAgentService.getEstateAgents().length).toEqual(3);

    estateAgentService.deleteEstateAgent(estateAgent2.uid);
    expect(estateAgentsChangedSpy).toHaveBeenCalledWith([estateAgent1, estateAgent3]);

    expect(estateAgentService.getEstateAgents().length).toEqual(2);
    expect(estateAgentService.getEstateAgents()).toEqual([estateAgent1, estateAgent3]);
  })

  it('#setEstateAgent should update an existing estate agent (and emit change event)', () => {
    const estateAgents: EstateAgent[] = [estateAgent1];
    estateAgentService.setEstateAgents(estateAgents);
    const updatedEstateAgent1 = {
      ...estateAgent1,
      town: 'Chunky town'
    };

    estateAgentService.setEstateAgent(estateAgent1.uid, updatedEstateAgent1);
    expect(estateAgentsChangedSpy).toHaveBeenCalledWith([estateAgent1]);

    expect(estateAgentService.getEstateAgents().length).toEqual(1);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).town).toEqual('Chunky town');
  })

  it('#addNoteToEstateAgent should add a note to the estate agent (and emit change event if not called silently) ', () => {
    estateAgentService.setEstateAgents([estateAgent1, estateAgent2]);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).notes.length).toEqual(0);

    // Add one loudly
    const firstNote: Note = new Note('This is my first note', getCurrentTimestamp(), NOTE_TYPES.NOT.key, userName);
    estateAgentService.addNoteToEstateAgent(estateAgent1.uid, firstNote);
    expect(estateAgentsChangedSpy).toHaveBeenCalledWith([estateAgent1, estateAgent2]);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).notes.length).toEqual(1);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).notes[0].text).toEqual('This is my first note');
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);

    // Add one in silence
    const secondNote: Note = new Note('This is my second note', getCurrentTimestamp(), NOTE_TYPES.NOT.key, userName);
    estateAgentService.addNoteToEstateAgent(estateAgent1.uid, secondNote, true);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).notes.length).toEqual(2);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).notes[1].text).toEqual('This is my second note');
  })

  it('#addPropertyToEstateAgent should add a property once to the given estate agent (and emit change event if not called silently)', () => {
    estateAgentService.setEstateAgents([estateAgent1]);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).propertyIds).toEqual([]);

    // Add one loudly
    estateAgentService.addPropertyToEstateAgent(estateAgent1.uid, property1.uid);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).propertyIds).toEqual([property1.uid]);

    // Add one in silence
    estateAgentService.addPropertyToEstateAgent(estateAgent1.uid, property2.uid, true);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).propertyIds).toEqual([property1.uid, property2.uid]);

    // Don't do dupes
    estateAgentService.addPropertyToEstateAgent(estateAgent1.uid, property1.uid);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).propertyIds).toEqual([property1.uid, property2.uid]);
  })

  it('#removePropertyFromEstateAgent should remove the given property from the estate agent (and emit change event if not called silently)', () => {
    estateAgentService.setEstateAgents([estateAgent1]);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(1);
    estateAgentService.addPropertyToEstateAgent(estateAgent1.uid, property1.uid, true);
    estateAgentService.addPropertyToEstateAgent(estateAgent1.uid, property2.uid, true);
    estateAgentService.addPropertyToEstateAgent(estateAgent1.uid, property3.uid, true);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).propertyIds).toEqual([property1.uid, property2.uid, property3.uid]);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(1);

    // Remove one loudly
    estateAgentService.removePropertyFromEstateAgent(estateAgent1.uid, property2.uid);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).propertyIds).toEqual([property1.uid, property3.uid]);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);

    // Remove one in silence
    estateAgentService.removePropertyFromEstateAgent(estateAgent1.uid, property1.uid, true);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).propertyIds).toEqual([property3.uid]);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);
  })

  it('#addNegotiatorToEstateAgent should add a negotiator to the given estate agent (and emit change event if not called silently)', () => {
    estateAgentService.setEstateAgents([estateAgent1]);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators).toEqual([]);

    // Add one loudly
    estateAgentService.addNegotiatorToEstateAgent(estateAgent1.uid, negotiator1);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators).toEqual([negotiator1]);

    // Add one in silence
    estateAgentService.addNegotiatorToEstateAgent(estateAgent1.uid, negotiator2, true);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators).toEqual([negotiator1, negotiator2]);
  })

  it('#deactivateNegotiatorOfEstateAgent should deactivate the estate agent\'s given negotiator (and emit change event if not called silently)', () => {
    estateAgentService.setEstateAgents([estateAgent1]);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators).toEqual([]);

    estateAgentService.addNegotiatorToEstateAgent(estateAgent1.uid, negotiator1, true);
    estateAgentService.addNegotiatorToEstateAgent(estateAgent1.uid, negotiator2, true);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators[0]).toEqual(negotiator1);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators[0].deleted).toBeFalsy();
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators[1]).toEqual(negotiator2);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators[1].deleted).toBeFalsy();
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(1);

    // Deactivate one loudly
    estateAgentService.deactivateNegotiatorOfEstateAgent(estateAgent1.uid, 0);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators[0].deleted).toBeTruthy();

    // Deactivate one insilence
    estateAgentService.deactivateNegotiatorOfEstateAgent(estateAgent1.uid, 1, true);
    expect(estateAgentsChangedSpy).toHaveBeenCalledTimes(2);
    expect(estateAgentService.getEstateAgent(estateAgent1.uid).negotiators[1].deleted).toBeTruthy();
  })

  it('#getEstateAgentsByPostcode should return a list of estate agents, with matching postcode - ordered ascending by postcode', () => {
    estateAgentService.setEstateAgents([estateAgent1, estateAgent2, estateAgent3, estateAgent4])
    expect(estateAgentService.getEstateAgentsByPostcode('M')).toEqual([estateAgent2, estateAgent4]);
    expect(estateAgentService.getEstateAgentsByPostcode('M35')).toEqual([estateAgent2, estateAgent4]);
    expect(estateAgentService.getEstateAgentsByPostcode('M35 9FE')).toEqual([estateAgent2]);
    expect(estateAgentService.getEstateAgentsByPostcode('OL')).toEqual([estateAgent3, estateAgent1]);
    expect(estateAgentService.getEstateAgentsByPostcode('OL8')).toEqual([estateAgent3]);

    expect(estateAgentService.getEstateAgentsByPostcode('m')).toEqual([estateAgent2, estateAgent4]);
    expect(estateAgentService.getEstateAgentsByPostcode('ol')).toEqual([estateAgent3, estateAgent1]);
  })

  it('#emitChanges should emit `estateAgentsChanged`', () => {
    estateAgentService.emitChanges();
    expect(estateAgentsChangedSpy).toHaveBeenCalledWith([]);
  })
})
