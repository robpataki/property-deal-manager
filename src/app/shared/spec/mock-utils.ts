import { AccountService } from '../../account/account.service';
import { Account } from 'src/app/account/account.model';
import { Property } from '../models/property.model';
import { Comparable } from '../models/comparable.model';
import { generateUID, getCurrentTimestamp } from '../utils';
import { Note } from '../models/note.model';
import { DEAL_TYPES } from '../services/app-constants.service';

export class MockUtils {
  static getMockAccountService() {
    return new MockAccountService();
  }

  static getMockProperties(): Property[] {
    return [
      new Property(
        generateUID('p_'),
        +getCurrentTimestamp(),
        
        '3rd floor Basil Chambers',
        '65 High Street',
        'Manchester',
        'M4 1FS',

        '',
        3,
        100,
        'D',
        'MDT',
        'FH',
        'AUC',
        100000,
        +getCurrentTimestamp(),
        [],
        {  strg: 'BTL' },
        [],
        [ new Note('Property card created', +getCurrentTimestamp(), 'NOT', 'johnd') ],
        [],
        []
      ),
      new Property(
        generateUID('p_'),
        +getCurrentTimestamp(),
        
        '56 Shoreditch High Street',
        '',
        'London',
        'E1 6JJ',

        '',
        5,
        500,
        'C',
        'BUN',
        'FH',
        'ESA',
        999999,
        +getCurrentTimestamp(),
        [],
        {  strg: 'BTL' },
        [],
        [ new Note('Property card created', +getCurrentTimestamp(), 'NOT', 'johnd') ],
        [],
        []
      ),
      new Property(
        generateUID('p_'),
        +getCurrentTimestamp(),
        
        '37 Heneage Street',
        '',
        'London',
        'E1 5LJ',

        '',
        2,
        88,
        'B',
        'ENT',
        'LH',
        'D2V',
        333333,
        +getCurrentTimestamp(),
        [],
        {  strg: 'FLP'},
        [],
        [],
        [],
        []
      )
    ];
  }

  static getMockComparables(): Comparable[] {
    return [
      new Comparable(
        generateUID('c_'),
        +getCurrentTimestamp(),
  
        'Address line 1',
        'Address line 2',
        'Funky town',
        'AB1 C34',
  
        '',
        3,
        42,
        'A',
        'D2V',
        'FH',
        99995,
        getCurrentTimestamp(),
        
        [],
        [],
        []
      ),
      new Comparable(
        generateUID('c_'),
        +getCurrentTimestamp(),
  
        'Address line 1',
        'Address line 2',
        'Honky town',
        'ZX9 W87',
  
        '',
        5,
        99,
        'C',
        'ESA',
        'LH',
        435000,
        +getCurrentTimestamp(),
        
        [],
        [],
        []
      ),
      new Comparable(
        generateUID('c_'),
        +getCurrentTimestamp(),
  
        'Address line 1',
        'Address line 2',
        'Dodgy town',
        'LM5 0BZ',
        
        '',
        2,
        72,
        'D',
        'AUC',
        'FH',
        45000,
        +getCurrentTimestamp(),
        
        [],
        [],
        []
      ),
      new Comparable(
        generateUID('c_'),
        +getCurrentTimestamp(),
  
        '400 Wilbraham Road',
        'Chorlton',
        'Manchester',
        'M21 0UB',
        
        '',
        9,
        400,
        'D',
        'ESA',
        'FH',
        1200000,
        +getCurrentTimestamp(),
        
        [],
        [],
        ['https://www.rightmove.co.uk/property-for-sale/property-72087862.html']
      ),
      new Comparable(
        generateUID('c_'),
        +getCurrentTimestamp(),
  
        '10 Dudley Road',
        'Whalley Range',
        'Manchester',
        'M16 8DX',
        
        '',
        5,
        400,
        'D',
        'ESA',
        'LH',
        525000,
        +getCurrentTimestamp(),
        
        [],
        [],
        ['https://www.rightmove.co.uk/property-for-sale/property-90832451.html']
      ),
      new Comparable(
        generateUID('c_'),
        +getCurrentTimestamp(),
  
        '22 Jenny Street',
        '',
        'Oldham',
        'OL8 4QN',
        
        '',
        2,
        88,
        'C',
        'ESA',
        'FH',
        199950,
        +getCurrentTimestamp(),
        
        [],
        [],
        ['https://www.rightmove.co.uk/property-for-sale/property-61431925.html']
      ),
      new Comparable(
        generateUID('c_'),
        +getCurrentTimestamp(),
  
        '31, Birchfield Drive',
        'Marland',
        'Rochdale',
        'OL11 4NY',
        
        '',
        2,
        88,
        'D',
        'D2V',
        'LH',
        309950,
        +getCurrentTimestamp(),
        
        [],
        [],
        ['https://www.rightmove.co.uk/property-for-sale/property-80684437.html']
      )
    ];
  }
}

class MockAccountService extends AccountService {
  getAccount() {
    return new Account({
      uid: 'u_123',
      public_profile: {
        displayName: 'johnd'
      },
      private_profile: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.me'
      }
    }, {
      uid: 'o_123',
      name: 'Mock Ltd.',
      members: [{
        'u_123': {
          displayName: 'johnd',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.me'
        }
      }]
    });
  }
}