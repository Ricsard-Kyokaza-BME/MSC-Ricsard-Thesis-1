import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OfferListItemComponent} from '../offer/offer-list-item.component';
import {CategoryFilterPipe} from '../offer/category-filter.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        OfferListItemComponent,
        CategoryFilterPipe
    ],
    exports: [
        OfferListItemComponent,
        CategoryFilterPipe
    ]
})
export class SdCommonModule {
}
