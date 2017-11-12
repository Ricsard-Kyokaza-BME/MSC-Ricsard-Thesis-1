import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../rest/authentication.service';
import {User} from '../../models/user.model';
import {RestService} from '../rest/rest.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {plainToClass} from 'class-transformer';

@Component({
    selector: 'sd-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

    @Input('offer')
    user: User;
    isOwnUser: boolean;
    private _userId: string;

    private routerIdSubscription: Subscription;

    constructor(private _authService: AuthenticationService, private _restService: RestService, private _route: ActivatedRoute) {
        this.user = new User();
        this.isOwnUser = false;
        this._userId = '';
    }

    ngOnInit(): void {
        this.routerIdSubscription = this._route.params.subscribe((params: Params) => {
            this._userId = params['id'];

            User.findById(this._restService, this._userId)
                .then(response => {
                    this.user = <User><any>plainToClass(User, response);

                    if ((this._authService.getSignedInUser() !== undefined) &&
                        (this.user.id === this._authService.getSignedInUser().id)) {
                        this.isOwnUser = true;
                    }
                });
        });
    }
}
