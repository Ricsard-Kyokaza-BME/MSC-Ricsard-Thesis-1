import {Component, OnDestroy, OnInit} from '@angular/core';
import {Offer} from '../../models/offer.model';
import {FileServerService} from '../rest/file-server.service';
import {RestService} from '../rest/rest.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {plainToClass} from 'class-transformer';
import {User} from '../../models/user.model';
import {Category} from '../../models/category.model';
import {Message} from "../../models/message.model";
import {AuthenticationService} from '../rest/authentication.service';

@Component({
    selector: 'sd-offer',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit, OnDestroy {

    private _offerId: string;
    private _routerIdSubscription: Subscription;

    offer: Offer;
    latitude: number;
    longitude: number;
    zoom: number;
    messageContent: string;
    fileServer: FileServerService;
    message: Message;

    constructor(private _restService: RestService, fileServer: FileServerService,
                private _route: ActivatedRoute, private _router: Router, private _authService: AuthenticationService) {
        this.fileServer = fileServer;
        this.messageContent = '';
        this.message = new Message();
    }

    ngOnInit(): void {
        this._routerIdSubscription = this._route.params.subscribe((params: Params) => {
            this._offerId = params['id'];

            Offer.findById(this._restService, this._offerId, {query: {$populate: ['owner', 'categories']}})
                .then(response => this.initOffer(response));
        });
    }

    initOffer(response) {
        this.offer = <Offer><any>plainToClass(Offer, response);
        this.offer.owner = plainToClass(User, this.offer.owner);
        this.offer.categories = plainToClass(Category, this.offer.categories);

        this.latitude = this.offer.coordinates[0] || 0.0;
        this.longitude = this.offer.coordinates[1] || 0.0;
        this.zoom = 16;
    }

    sendMessage() {
        this.message.content = this.messageContent;
        this.message.to = (this.offer.owner as User).id;

        this.message.create().then(response => this._router.navigate(['/']));
    }

    isSignedInUserOwn() {
        if (this._authService.getSignedInUser() == undefined) {
            return false;
        }

        if (this.offer.owner === this._authService.getSignedInUser().id) {
            return true;
        } else if (
            (typeof this.offer.owner === 'object')
            && (this.offer.owner as Object).hasOwnProperty('_id')
            && (this.offer.owner['_id'] === this._authService.getSignedInUser().id)) {
            return true;
        }
        return false;
    }

    editOffer() {
        if(this.isSignedInUserOwn()) {
            this._router.navigate(['/offer/edit/' + this.offer.id]);
        }
    }

    ngOnDestroy() {
        this._routerIdSubscription.unsubscribe();
    }
}
