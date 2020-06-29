import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { firebaseConfig } from '../../environments/environment';
import { AccountService } from '../account/account.service';
import { AuthSession } from './auth-session.model';
import { PropertyService } from '../properties/property.service';
import { ComparableService } from '../comparables/comparable.service';

const AUTH_API_SIGNIN_URL: string = firebaseConfig.authSignInUrl;
const AUTH_API_REFRESH_TOKEN_URL: string = firebaseConfig.authRefreshTokenUrl;
const AUTH_API_RESET_PASSWORD_URL: string = firebaseConfig.authResetPasswordUrl;
const API_KEY: string = firebaseConfig.apiKey;
const SESSION_STORAGE_ID: string = 'authSession';
const DEFAULT_TOKEN_RENEWAL_INTERVAL: number = 3300000; // 55 minutes

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface TokenResponseData {
  access_token: string;
  expires_in: string;
  id_token: string;
  project_id: string;
  refresh_token: string;
  token_type: string;
  user_id: string;
}

@Injectable()
export class AuthService {
  authSession: BehaviorSubject<AuthSession> = new BehaviorSubject<AuthSession>(null);
  autoSignOutTimer: any;
  autoRenewTimer: any;
  hasActiveSession: boolean;
  _uid: string;
  _email: string;
  _refreshToken: string;

  constructor(private http: HttpClient,
              private router: Router,
              private accountService: AccountService,
              private propertyService: PropertyService,
              private comparableService: ComparableService) {}

  get uid(): string {
    return this._uid;
  }

  get email(): string {
    return this._email;
  }

  signIn(email: string, password: string): Observable<AuthResponseData> {
    const signInData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthResponseData>(
      AUTH_API_SIGNIN_URL, 
      signInData,
      {
        params: {
          key: API_KEY
        }
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn, resData.refreshToken);
      })
    );
  }

  signOut() {
    // Kill the auto sign out timer
    if (this.autoSignOutTimer) {
      clearTimeout(this.autoSignOutTimer);
    }
    this.autoSignOutTimer = null;

    this.hasActiveSession = false;
    
    // Remove the session data from local storage
    this.destroyAuthSession();

    // Clear the session data from memory
    this.accountService.reset();
    this.propertyService.reset();
    this.comparableService.reset();

    this.authSession.next(null);
    this.router.navigate(['/auth']);
  }

  resetPassword(email: string): Observable<any> {
    const resetData = {
      email: email,
      requestType: 'PASSWORD_RESET'
    };

    return this.http.post<AuthResponseData>(
      AUTH_API_RESET_PASSWORD_URL, 
      resetData,
      {
        params: {
          key: API_KEY
        }
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  autoSignIn(): void {
    // Retrieve session data from persistent storage
    const restoredAuthSession: AuthSession = this.fetchAuthSession();

    if (!restoredAuthSession) {
      return;
    }

    // If the session hasn't expired yet...
    if (restoredAuthSession.token) {
      this.hasActiveSession = true;

      this._uid = restoredAuthSession.id;
      this._email = restoredAuthSession.email;
      this._refreshToken = restoredAuthSession.refreshToken;
      
      this.authSession.next(restoredAuthSession);      
      // console.log('[Auth Service] - autoSignIn()');
      this.startAutoRenewTimer();      
    }
  }

  startAutoSignOutTimer(expirationDuration: number): void {
    this.autoSignOutTimer = setTimeout(() => {
      this.signOut();
      // Redirect the user to the auth path ONLY if the session expires automatically
      this.router.navigate(['/auth']);
    }, expirationDuration);
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number, refreshToken: string) {
    this.hasActiveSession = true;

    const expirationTimestamp = Date.now() + (+expiresIn * 1000);
    const authSession = new AuthSession(email, localId, idToken, refreshToken, expirationTimestamp);
    
    this._uid = localId;
    this._email = email;
    this._refreshToken = refreshToken;

    // Save auth data in persistent storage
    this.storeAuthSession(authSession);

    this.authSession.next(authSession);
    this.startAutoRenewTimer();
  }

  startAutoRenewTimer(): void {
    const expirationTimestamp: number = this.authSession.value.expirationTimestamp;
    const timeLeft: number = expirationTimestamp - Date.now();
    // We want to renew a minute before the token expires
    const delay = timeLeft > 60000 ? timeLeft - 60000 : timeLeft * 0.75;

    // console.log('[Auth Service] - startAutoRenewTimer() - delay: ', delay);
    // console.log('[Auth Service] - startAutoRenewTimer() - Token expires: ', new Date(expirationTimestamp));
    // console.log('[Auth Service] - startAutoRenewTimer() - Request new token: ', new Date(Date.now() + delay));
    
    this.autoRenewTimer = setTimeout(() => {
      this.renewIdToken();
    }, delay);
  }

  renewIdToken(): void {
    // console.log('renewIdToken()');

    // Kill the auto timer
    if (this.autoRenewTimer) {
      clearTimeout(this.autoRenewTimer);
    }
    this.autoRenewTimer = null;

    const requestData = {
      grant_type: 'refresh_token',
      refresh_token: this._refreshToken
    };

    this.http.post<TokenResponseData>(
      AUTH_API_REFRESH_TOKEN_URL, 
      requestData,
      {
        params: {
          key: API_KEY
        }
      }
    ).subscribe(resData => {
      this.handleAuthentication(this._email, resData.user_id, resData.id_token, +resData.expires_in, resData.refresh_token);
    });
  }

  storeAuthSession(authSession: AuthSession): void {
    localStorage.setItem(SESSION_STORAGE_ID, JSON.stringify(authSession));
  }

  fetchAuthSession(): AuthSession {
    const restoredAuthSession = JSON.parse(localStorage.getItem(SESSION_STORAGE_ID));
    if (!restoredAuthSession) {
      return
    }
    
    return new AuthSession(
      restoredAuthSession.email,
      restoredAuthSession.id,
      restoredAuthSession._token,
      restoredAuthSession.refreshToken,
      +restoredAuthSession.expirationTimestamp);
  }

  destroyAuthSession(): void {
    this.hasActiveSession = false;
    localStorage.removeItem(SESSION_STORAGE_ID);
  }

  handleError(errorResponse: HttpErrorResponse): Observable<any> {
    let errorMessage = 'There was an error, please try again.'
    
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMessage = `Can't find a user with that email address.`
        break
      case 'INVALID_PASSWORD':
        errorMessage = `Your password doesn't match.`
        break
    }

    return throwError(errorMessage);
  }
}