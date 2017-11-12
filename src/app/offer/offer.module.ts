import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CreateOfferComponent} from './create-offer.component';
import {OwnOffersComponent} from './own-offers.component';
import {SdCommonModule} from '../sd-common/sd-common.module';
import {AgmCoreModule} from '@agm/core';
import {OfferComponent} from './offer.component';
import {IsLoggedInGuard} from '../guards/is-logged-in.guard';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SdCommonModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD9xGRYapFoX0Q84tiunb2IpmgOVnB5mDs',
            libraries: ['places']
        }),
        RouterModule.forChild([
            {path: 'create', component: CreateOfferComponent, pathMatch: 'full', canActivate: [IsLoggedInGuard]},
            {path: 'own', component: OwnOffersComponent, pathMatch: 'full', canActivate: [IsLoggedInGuard]},
            {path: ':id', component: OfferComponent, pathMatch: 'full'}
        ])
    ],
    declarations: [CreateOfferComponent, OwnOffersComponent, OfferComponent]
})
export class OfferModule {
}
