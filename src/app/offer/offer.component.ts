import {Component, OnDestroy, OnInit} from '@angular/core';
import {Offer} from '../../models/offer.model';
import {FileServerService} from '../rest/file-server.service';
import {RestService} from '../rest/rest.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {plainToClass} from 'class-transformer';

@Component({
    selector: 'sd-offer',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit, OnDestroy {

    offer: Offer;
    private _offerId: string;
    public latitude: number;
    public longitude: number;
    public zoom: number;
    fileServer: FileServerService;
    private _routerIdSubscription: Subscription;

    constructor(private _restService: RestService, fileServer: FileServerService, private _route: ActivatedRoute) {
        this.fileServer = fileServer;
    }

    ngOnInit(): void {
        this._routerIdSubscription = this._route.params.subscribe((params: Params) => {
            this._offerId = params['id'];

            Offer.findById(this._restService, this._offerId)
                .then(response => this.initOffer(response));
        });
    }

    initOffer(response) {
        this.offer = <Offer><any>plainToClass(Offer, response);

        this.latitude = this.offer.coordinates[0] || 0.0;
        this.longitude = this.offer.coordinates[1] || 0.0;
        this.zoom = 12;
    }

    ngOnDestroy() {
        this._routerIdSubscription.unsubscribe();
    }
}
