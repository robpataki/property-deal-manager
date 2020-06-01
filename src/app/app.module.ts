import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/modules/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './footer/footer.component';
import { AuthService } from './auth/auth.service';
import { AccountComponent } from './account/account.component';

import { DataStorageService } from './shared/services/data-storage.service';
import { AccountResolverService } from './account/account-resolver.service';
import { AccountService } from './account/account.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { PropertyService } from './properties/property.service';
import { PropertiesResolverService } from './properties/properties-resolver.service';
import { AuthResolverService } from './auth/auth-resolver.service';
import { AccountAndPropertiesResolverService } from './shared/services/account-and-properties-resolver.service';
import { AppConstantsService } from './shared/services/app-constants.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule } from './datepicker/datepicker.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    DatePickerModule
  ],
  providers: [
    AppConstantsService,
    AuthService,
    AuthResolverService,
    DataStorageService,
    AccountService,
    AccountResolverService,
    PropertyService,
    PropertiesResolverService,
    AccountAndPropertiesResolverService,
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
