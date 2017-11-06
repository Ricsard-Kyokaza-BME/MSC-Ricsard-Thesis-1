import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {RestService} from './rest/rest.service';
import {FormsModule} from '@angular/forms';
import {AuthenticationService} from './rest/authentication.service';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'login', loadChildren: './login/login.module#LoginModule'},
      { path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpModule'},
      { path: 'offer', loadChildren: './offer/offer.module#OfferModule'}
    ])
  ],
  providers: [
      RestService,
      AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
