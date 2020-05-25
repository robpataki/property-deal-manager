import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, finalize, mergeMap } from 'rxjs/operators';

import { firebaseConfig } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Account } from '../account/account.model';
import { User } from './user.model';
import { AccountService } from '../account/account.service';
import { Property } from './property.model';
import { PropertyService } from '../properties/property.service';
import { Organisation } from './organisation.model';


const API_URL: string = firebaseConfig.databaseUrl;
// TODO - Get the user's organisation ID from the database
const ORG_ID: string = 'solidus_properties';
const PROPERTY_ID: string = 'property_1';

@Injectable()
export class DataStorageService {  
  constructor(private http: HttpClient,
              private authService: AuthService,
              private accountService: AccountService,
              private propertyService: PropertyService) {}

  fetchAccount(): Observable<any> {
    const uid = this.authService.uid;
    let orgUid: string;
    let user: User;
    let organisation: Organisation;
    let account: Account;

    // Fetch the user data
    return this.http.get<any>(`${API_URL}/users/${uid}.json`)
      .pipe(
        mergeMap(userData => {
          user = new User(uid, userData.private_profile, userData.public_profile);
          orgUid = userData.private_profile.organisation;

          return this.http.get<any>(`${API_URL}/organisations/${orgUid}.json`).pipe(
            map(orgData => {
              const organisationMembers = Object.keys(orgData.members).map(key => {
                return {
                  uid: key,
                  ...orgData.members[key]
                }
              });
              organisation = new Organisation(orgUid, orgData.meta_data.name, organisationMembers);
            }),
            tap((orgData) => {
              account = new Account(user, organisation);
              this.accountService.setAccount(account);
            })
          )
        })
      );
  }

  fetchProperties(): Observable<Property[]> {  
    return this.http.get<Property[]>(`${API_URL}/properties/${ORG_ID}.json`)
    .pipe(
      map(propertiesObj => {
        if (!!propertiesObj) {
          return Object.keys(propertiesObj).map(key => new Property(
            key,
            propertiesObj[key].addressLine1,
            propertiesObj[key].addressLine2,
            propertiesObj[key].postcode,
            propertiesObj[key].town,
            propertiesObj[key].thumbnailUrl,
            propertiesObj[key].epc,
            propertiesObj[key].size,
            propertiesObj[key].type,
            propertiesObj[key].dealType
          ));
        }
        return [];
      }),
      tap(properties => {
        this.propertyService.setProperties(properties);
      })
    );
  }
}
