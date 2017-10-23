import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { CreateOfferComponent } from './create-offer.component';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      RouterModule.forChild([
          {path: 'create', component: CreateOfferComponent, pathMatch: 'full'}
      ])
  ],
  declarations: [CreateOfferComponent]
})
export class OfferModule { }
