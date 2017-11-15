import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {RestService} from './rest/rest.service';
import {FormsModule} from '@angular/forms';
import {AuthenticationService} from './rest/authentication.service';
import {HttpModule} from '@angular/http';
import {FileServerService} from './rest/file-server.service';
import {SdCommonModule} from './sd-common/sd-common.module';
import {IsLoggedInGuard} from "./guards/is-logged-in.guard";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    FormsModule,
    HttpModule,
    SdCommonModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'login', loadChildren: './login/login.module#LoginModule'},
      { path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpModule'},
      { path: 'offer', loadChildren: './offer/offer.module#OfferModule'},
      { path: 'user', loadChildren: './user/user.module#UserModule'},
      { path: 'message', loadChildren: './message/message.module#MessageModule'},
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule'}
    ])
  ],
  providers: [
      RestService,
      AuthenticationService,
      FileServerService,
      IsLoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
