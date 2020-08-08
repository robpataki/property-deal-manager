import { AccountService } from '../../account/account.service';
import { Account } from 'src/app/account/account.model';
import { Property } from '../models/property.model';
import { Comparable } from '../models/comparable.model';
import { generateUID, getCurrentTimestamp } from '../utils';
import { Note } from '../models/note.model';
import { DEAL_TYPES } from '../services/app-constants.service';
import { EstateAgent } from '../models/estate-agent.model';

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

        '',
        -1,
        null,
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

        '',
        -1,
        null,
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

        '',
        -1,
        null,
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

  static getMockEstateAgents(): EstateAgent[] {
    return [
      new EstateAgent(
        generateUID('ea_'),
        +getCurrentTimestamp(),

        'Ryder & Dutton',
        'Chadderton',
        '',
        '0161 681 3754',
        'https://www.ryder-dutton.co.uk/liquid_assets/images/rd-logo.png',

        '635 Broadway',
        'Chadderton',
        'Oldham',
        'OL9 8DN',

        [],
        [],
        [],
        ['https://www.ryder-dutton.co.uk/']
      ),
      new EstateAgent(
        generateUID('ea_'),
        +getCurrentTimestamp(),

        'Cousins',
        'Failsworth',
        'failsworth@cousins.co.uk',
        '0161 681 2371',
        'https://www.cousins.uk/images/logo.png',

        '754 Oldham Road',
        'Failsworth',
        'Manchester',
        'M35 9FE',

        [],
        [],
        [],
        ['https://www.cousins.uk/']
      ),
      new EstateAgent(
        generateUID('ea_'),
        +getCurrentTimestamp(),

        'Hunters',
        'Oldham',
        'oldham@hunters.com',
        '0161 669 4833',
        'https://www.hunters.com/application/themes/rawnet/app/images/content/hunters-logo.svg',

        '832 Hollins Rd',
        'Hollinwood',
        'Oldham',
        'OL8 4SR',

        [],
        [],
        [],
        ['https://www.hunters.com']
      ),
      new EstateAgent(
        generateUID('ea_'),
        +getCurrentTimestamp(),

        'NPE',
        'Failsworth',
        'sales@npestates.co.uk',
        '0161 682 1001',
        'http://www.npestates.co.uk/wp-content/uploads/2013/11/NPE-logo.jpg',

        '61 Ashton Rd E',
        'Failsworth',
        'Manchester',
        'M35 9PW',

        [],
        [],
        [],
        ['http://www.npestates.co.uk/']
      )

    ]
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
