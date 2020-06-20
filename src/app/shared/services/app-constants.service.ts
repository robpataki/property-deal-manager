import { Injectable } from '@angular/core'

@Injectable()
export class AppConstantsService {}

export const PROPERTY_TYPES: any = {
  MDT: {
    key: 'MDT',
    value: 'Mid terrace'
  },
  ENT: {
    key: 'ENT',
    value: 'End terrace'
  },
  BUN: {
    key: 'BUN',
    value: 'Bungalow'
  },
  FLT: {
    key: 'FLT',
    value: 'Flat'
  },
  DTH: {
    key: 'DTH',
    value: 'Detached house'
  },
  SDH: {
    key: 'SDH',
    value: 'Semi-detached house'
  }
}

export const DEAL_TYPES: any = {
  ESA: {
    key: 'ESA',
    value: 'Open market'
  },
  D2V: {
    key: 'D2V',
    value: 'Direct to vendor'
  },
  AUC:{
    key: 'AUC',
    value: 'Auction'
  }
}

export const EPC_RATINGS: any = {
  A: {
    key: 'A',
    value: 'A'
  },
  B: {
    key: 'B',
    value: 'B'
  },
  C: {
    key: 'C',
    value: 'C'
  },
  D: {
    key: 'D',
    value: 'D'
  },
  E: {
    key: 'E',
    value: 'E'
  },
  F: {
    key: 'F',
    value: 'F'
  },
  G: {
    key: 'G',
    value: 'G'
  }
}

export const NOTE_TYPES: any = {
  VIE: {
    key: 'VIE',
    value: 'Viewing'
  },
  OFF: {
    key: 'OFF',
    value: 'Offer'
  },
  NOT: {
    key: 'NOT',
    value: 'Note'
  }
}

export const STRATEGIES: any = {
  FLP: {
    key: 'FLP',
    value: 'Flip'
  },
  BTL: {
    key: 'BTL',
    value: 'Buy-to-Let'
  }
}

export const CRUNCH_DEFAULTS: any = {
  BTL: {
    BROKER: 649,
    SURVEY: 300,
    SOURCER: 3000,
    SOLICITOR: 1000,
    INSURANCE: 25,
    MOE: 0.1,
    MANAGEMENT: 0.1,
    LTV: 75,
    HOLDING_COST: {
      COUNCIL_TAX: 100,
      ENERGY: 50,
      WATER: 28,
      GROUND_RENT: 0,
      SERVICE_CHARGE: 0,
      TIMES: 6
    }
  },
  FLP: {
    BROKER: 649,
    SURVEY: 300,
    SOURCER: 0,
    SOLICITOR: 2000,
    INSURANCE: 30,
    HOLDING_COST: {
      COUNCIL_TAX: 100,
      ENERGY: 50,
      WATER: 28,
      GROUND_RENT: 0,
      SERVICE_CHARGE: 0,
      TIMES: 6
    }
  }
}
