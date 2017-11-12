import {Component, OnInit} from '@angular/core';
import {Offer} from '../../models/offer.model';
import {plainToClass} from 'class-transformer';
import {RestService} from '../rest/rest.service';
import {AuthenticationService} from '../rest/authentication.service';
import {User} from '../../models/user.model';

@Component({
    selector: 'sd-own-offers',
    templateUrl: './own-offers.component.html',
    styleUrls: ['./own-offers.component.scss']
})
export class OwnOffersComponent implements OnInit {

    offers: Offer[];

    constructor(private _restService: RestService, private _authService: AuthenticationService) {
        this.offers = [];
    }

    ngOnInit() {
        if(this._authService.getSignedInUser() == undefined) {
            this._authService.loginEvent.subscribe((user: User) => {
                this.getUserOffers(user.id);
            });
        } else {
            this.getUserOffers(this._authService.getSignedInUser().id);
        }
    }

    getUserOffers(userid: string) {
        Offer.find(this._restService, {
            query: {
                owner: userid,
                $populate: 'categories'
            }
        }).then(
            response => {
                this.offers = plainToClass(Offer, response.data);
            });
    }

}
