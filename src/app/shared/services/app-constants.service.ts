import { Injectable } from '@angular/core'

@Injectable()
export class AppConstantsService {}

export const PROPERTY_TYPES: {} = {
  'MDT': {
    key: 'MDT',
    value: 'Mid terrace'
  },
  'ENT': {
    key: 'ENT',
    value: 'End terrace'
  },
  'BUN': {
    key: 'BUN',
    value: 'Bungalow'
  },
  'FLT': {
    key: 'FLT',
    value: 'Flat'
  },
  'DTH': {
    key: 'DTH',
    value: 'Detached house'
  },
  'SDH': {
    key: 'SDH',
    value: 'Semi-detached house'
  }
}

export const DEAL_TYPES: {} = {
  'ESA': {
    key: 'ESA',
    value: 'Open market'
  },
  'D2V': {
    key: 'D2V',
    value: 'Direct to vendor'
  },
  'AUC':{
    key: 'AUC',
    value: 'Auction'
  }
}

export const EPC_RATINGS: {} = {
  'A': {
    key: 'A',
    value: 'A'
  },
  'B': {
    key: 'B',
    value: 'B'
  },
  'C': {
    key: 'C',
    value: 'C'
  },
  'D': {
    key: 'D',
    value: 'D'
  },
  'E': {
    key: 'E',
    value: 'E'
  },
  'F': {
    key: 'F',
    value: 'F'
  },
  'G': {
    key: 'G',
    value: 'G'
  }
}

export const NOTE_TYPES: any = {
  'VIE': {
    key: 'VIE',
    value: 'Viewing'
  },
  'OFF': {
    key: 'OFF',
    value: 'Offer'
  },
  'NOT': {
    key: 'NOT',
    value: 'Note'
  }
}