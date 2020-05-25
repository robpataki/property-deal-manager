import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './footer/footer.component';
import { AuthService } from './auth/auth.service';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { DataStorageService } from './shared/data-storage.service';
import { AccountResolverService } from './account/account-resolver.service';
import { AccountService } from './account/account.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { PropertyService } from './properties/property.service';
import { PropertiesResolverService } from './properties/properties-resolver.service';
import { AuthResolverService } from './auth/auth-resolver.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    AuthService,
    AuthResolverService,
    DataStorageService,
    AccountService,
    AccountResolverService,
    PropertyService,
    PropertiesResolverService,
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
