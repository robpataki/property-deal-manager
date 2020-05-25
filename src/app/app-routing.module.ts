import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './auth/auth.guard';
import { AccountResolverService } from './account/account-resolver.service';
import { PropertiesResolverService } from './properties/properties-resolver.service';
import { AuthResolverService } from './auth/auth-resolver.service';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home',
    component:  HomeComponent },
  
  { path: 'auth',
    resolve: [AuthResolverService],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  
  { path: 'account',
    canActivate: [AuthGuard],
    resolve: [AccountResolverService],
    component:  AccountComponent
  },

  { path: 'properties',
    canActivate: [AuthGuard],
    resolve: [PropertiesResolverService],
    loadChildren: () => import('./properties/properties.module').then(m => m.PropertiesModule) },
  
  { path: 'not-found', 
    component: NotFoundComponent, 
    data: { 
      message: 'Unfortunately the page you\'re looking for isn\'t available to you, or doesn\'t exist.' 
    }
  },

  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    preloadingStrategy: PreloadAllModules,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
