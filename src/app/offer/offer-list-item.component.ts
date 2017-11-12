import {Component, Input} from '@angular/core';
import {Offer} from '../../models/offer.model';
import {FileServerService} from '../rest/file-server.service';

@Component({
    selector: 'sd-offer-list-item',
    templateUrl: './offer-list-item.component.html',
    styleUrls: ['./offer-list-item.component.scss']
})
export class OfferListItemComponent {

    @Input('offer')
    offer: Offer;
    fileServer: FileServerService;

    constructor(fileServer: FileServerService) {
        this.fileServer = fileServer;
    }

}
