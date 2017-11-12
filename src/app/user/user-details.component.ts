import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../rest/authentication.service';
import {User} from '../../models/user.model';
import {RestService} from '../rest/rest.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {plainToClass} from 'class-transformer';
import {Roles} from '../../models/roles.enum';

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
    userRole: string;

    private routerIdSubscription: Subscription;

    constructor(private _authService: AuthenticationService, private _restService: RestService,
                private _route: ActivatedRoute, private _router: Router) {
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
                    this.user.hasRole(Roles.Seller) ? this.userRole = Roles.Seller : this.userRole = Roles.User;

                    if ((this._authService.getSignedInUser() !== undefined) &&
                        (this.user.id === this._authService.getSignedInUser().id)) {
                        this.isOwnUser = true;
                    }
                });
        });
    }

    setUserRole() {
        switch (this.userRole) {
            case Roles.User: {
                this.removeRole(Roles.Seller);
                this.user.roles.push(Roles.User);
                break;
            }
            case Roles.Seller: {
                this.removeRole(Roles.User);
                this.user.roles.push(Roles.Seller);
                break;
            }
        }
    }

    private removeRole(role: Roles) {
        const roleIndex = this.user.roles.indexOf(role);
        if (roleIndex > -1) {
            this.user.roles.splice(roleIndex, 1);
        }
    }

    save() {
        this.setUserRole();
        this.user.patch().then(() => {
            this._authService.updateSignedInUser();
            this._router.navigate(['/']);
        });
    }
}
