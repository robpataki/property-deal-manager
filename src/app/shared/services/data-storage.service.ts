import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

import { firebaseConfig } from '../../../environments/environment';
import { Account } from '../../account/account.model';
import { User } from '../models/user.model';
import { AccountService } from '../../account/account.service';
import { Property } from '../models/property.model';
import { PropertyService } from '../../properties/property.service';
import { Organisation } from '../models/organisation.model';
import { AuthService } from '../../auth/auth.service';
import { STRATEGIES } from './app-constants.service';
import { Comparable } from '../models/comparable.model';
import { ComparableService } from 'src/app/comparables/comparable.service';

const API_URL: string = firebaseConfig.databaseUrl;

@Injectable()
export class DataStorageService {
  organisationId: string;

  constructor(private http: HttpClient,
              private accountService: AccountService,
              private propertyService: PropertyService,
              private comparableService: ComparableService,
              private authService: AuthService) {}

  fetchAccount(): Promise<any> {
    return new Promise((resolve, reject) => {
      const uid: string = this.authService.uid;
      let orgUid: string;
      let user: User;
      let organisation: Organisation;
      let account: Account;

      this.http.get<any>(`${API_URL}/users/${uid}.json`)
      .toPromise()
      .then(userData => {
        user = new User(uid, userData.private_profile, userData.public_profile);
        this.organisationId = orgUid = userData.private_profile.organisation;

        this.http.get<any>(`${API_URL}/organisations/${orgUid}.json`)
        .toPromise()
        .then(orgData => {
          const organisationMembers = Object.keys(orgData.members).map(key => {
            return {
              uid: key,
              ...orgData.members[key]
            }
          });
          organisation = new Organisation(orgUid, orgData.meta_data.name, organisationMembers);

          account = new Account(user, organisation);
          this.accountService.setAccount(account);

          resolve(account);
        }, error => {
          reject(error);
        })
      }, error => {
        reject(error);
      })
    })
  }

  fetchProperties(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<Property[]>(`${API_URL}/properties/${this.organisationId}.json`)
      .toPromise()
      .then(propertiesData => {
        let properties = [];

        if (!!propertiesData) {
          properties = Object.keys(propertiesData).map(key => new Property(
            key,
            propertiesData[key].createTimestamp ? +propertiesData[key].createTimestamp : 0,
            propertiesData[key].addressLine1,
            propertiesData[key].addressLine2,
            propertiesData[key].town,
            propertiesData[key].postcode,

            propertiesData[key].thumbnailUrl,
            !isNaN(+propertiesData[key].bedrooms) ? +propertiesData[key].bedrooms : 0,
            !isNaN(+propertiesData[key].size) ? +propertiesData[key].size : 0,
            propertiesData[key].epc,
            propertiesData[key].type,
            propertiesData[key].tenureType,
            propertiesData[key].dealType,
            +propertiesData[key].askingPrice,
            propertiesData[key].marketTimestamp ? +propertiesData[key].marketTimestamp : 0,

            (!propertiesData[key].links ? [] : propertiesData[key].links),
            (!propertiesData[key].crunch ? {
              strg: STRATEGIES.BTL.key
            } : propertiesData[key].crunch),
            (!propertiesData[key].comparables ? [] : propertiesData[key].comparables),

            (!propertiesData[key].notes ? [] : propertiesData[key].notes),
            (!propertiesData[key].offers ? [] : propertiesData[key].offers),
            (!propertiesData[key].viewings ? [] : propertiesData[key].viewings)
          ));
        }

        this.propertyService.setProperties(properties);
        resolve(properties);
      }, error => {
        reject(error);
      });
    });
  }

  storeProperty(propertyId: string): Promise<Property | void> {
    const property = this.propertyService.getProperty(propertyId);

    return this.http.put<any>(
      `${API_URL}/properties/${this.organisationId}/${propertyId}.json`,
      property
    ).toPromise();
  }

  deleteProperty(propertyId: string): Promise<Property | void> {
    return this.http.delete<any>(
      `${API_URL}/properties/${this.organisationId}/${propertyId}.json`,
    ).toPromise();
  }

  fetchComparables(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<Comparable[]>(`${API_URL}/comparables/${this.organisationId}.json`)
      .toPromise()
      .then(comparablesData => {
        let comparables = [];

        if (!!comparablesData) {
          comparables = Object.keys(comparablesData).map(key => new Comparable(
            key,
            comparablesData[key].timestamp ? +comparablesData[key].timestamp : 0,
            comparablesData[key].addressLine1,
            comparablesData[key].addressLine2,
            comparablesData[key].town,
            comparablesData[key].postcode,

            comparablesData[key].thumbnailUrl,
            !isNaN(+comparablesData[key].bedrooms) ? +comparablesData[key].bedrooms : 0,
            !isNaN(+comparablesData[key].size) ? +comparablesData[key].size : 0,
            comparablesData[key].epc,
            comparablesData[key].type,
            comparablesData[key].tenureType,
            +comparablesData[key].soldPrice,
            comparablesData[key].soldTimestamp ? +comparablesData[key].soldTimestamp : 0,

            (!comparablesData[key].properties ? [] : comparablesData[key].properties),
            (!comparablesData[key].notes ? [] : comparablesData[key].notes),
            (!comparablesData[key].links ? [] : comparablesData[key].links)
          ));
        }

        this.comparableService.setComparables(comparables);
        resolve(comparables);
      }, error => {
        reject(error);
      });
    });
  }

  storeComparable(comparableId: string): Promise<Property | void> {
    const comparable: Comparable = this.comparableService.getComparable(comparableId);

    return this.http.put<any>(
      `${API_URL}/comparables/${this.organisationId}/${comparableId}.json`,
      comparable
    ).toPromise();
  }

  deleteComparable(comparableId: string): Promise<Property | void> {
    return this.http.delete<any>(
      `${API_URL}/comparables/${this.organisationId}/${comparableId}.json`,
    ).toPromise();
  }

  storeUpdatedPropertyComparables(propertyIds: string[]): Promise<Property[] | void> {
    const patchPropertyComparables = this.patchPropertyComparables.bind(this);
    // Sequence of promises
    const updateProperty = function(propertyIds) {
      let promise = Promise.resolve();
      propertyIds.forEach(propertyId => {
        promise = promise.then(() => patchPropertyComparables(propertyId));
      });
      return promise;
    };
    return updateProperty(propertyIds);
  }

  patchPropertyComparables(propertyId: string): Promise<Property[] | void> {
    const property: Property = this.propertyService.getProperty(propertyId);
    console.log('[DataStorageService] - patchPropertyComparables() - ', propertyId, property.comparables);
    return this.http.patch<any>(
      `${API_URL}/properties/${this.organisationId}/${propertyId}.json`,
      {
        comparables: property.comparables
      }
    ).toPromise();
  }
}
