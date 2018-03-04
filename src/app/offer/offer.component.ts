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
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'sd-offer',
    animations: [
        trigger(
            'showAnimation',
            [
                transition(
                    ':enter', [
                        style({transform: 'scale(0.1)', opacity: 0}),
                        animate('300ms', style({transform: 'scale(1)', 'opacity': 1}))
                    ]
                ),
                transition(
                    ':leave', [
                        style({transform: 'scale(1)', 'opacity': 1}),
                        animate('300ms', style({transform: 'scale(0.1)', 'opacity': 0}))
                    ]
                )]
        )
    ],
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
