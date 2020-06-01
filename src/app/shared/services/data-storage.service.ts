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

const API_URL: string = firebaseConfig.databaseUrl;

@Injectable()
export class DataStorageService {
  organisationId: string;

  constructor(private http: HttpClient,
              private accountService: AccountService,
              private propertyService: PropertyService,
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
            propertiesData[key].createTimestamp ? propertiesData[key].createTimestamp.toString() : '',
            propertiesData[key].addressLine1,
            propertiesData[key].addressLine2,
            propertiesData[key].postcode,
            propertiesData[key].town,
            propertiesData[key].thumbnailUrl,
            propertiesData[key].bedrooms,
            propertiesData[key].size,
            propertiesData[key].epc,
            propertiesData[key].type,
            propertiesData[key].dealType,
            +propertiesData[key].askingPrice,
            propertiesData[key].marketTimestamp ? propertiesData[key].marketTimestamp.toString() : '',
            (!propertiesData[key].links ? [] : propertiesData[key].links),

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

  storeProperty(organisationId: string, propertyId: string): Promise<Property | void> {
    const property = this.propertyService.getProperty(propertyId);

    return this.http.put<any>(
      `${API_URL}/properties/${organisationId}/${propertyId}.json`,
      property
    ).toPromise();
  }

  deleteProperty(organisationId: string, propertyId: string): Promise<Property | void> {
    return this.http.delete<any>(
      `${API_URL}/properties/${organisationId}/${propertyId}.json`,
    ).toPromise();
  }
}
