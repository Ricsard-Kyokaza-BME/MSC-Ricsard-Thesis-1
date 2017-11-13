import {Component, Input} from '@angular/core';
import {Offer} from '../../models/offer.model';
import {FileServerService} from '../rest/file-server.service';
import {AuthenticationService} from "../rest/authentication.service";
import {Router} from "@angular/router";

@Component({
    selector: 'sd-offer-list-item',
    templateUrl: './offer-list-item.component.html',
    styleUrls: ['./offer-list-item.component.scss']
})
export class OfferListItemComponent {

    @Input('offer')
    offer: Offer;
    fileServer: FileServerService;

    constructor(fileServer: FileServerService, private _authService: AuthenticationService, private _router: Router) {
        this.fileServer = fileServer;
    }

    getSignedInUserId() {
        return this._authService.getSignedInUser().id;
    }

    editOffer() {
        this._router.navigate(['/offer/edit/' + this.offer.id]);
    }
}