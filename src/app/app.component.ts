import {Component} from '@angular/core';
import {AuthenticationService} from './rest/authentication.service';
import {Router} from '@angular/router';
import {Roles} from '../models/roles.enum';


@Component({
    selector: 'sd-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    Roles = Roles;

    constructor(private _authService: AuthenticationService, private _router: Router) {
    }

    isLoggedIn() {
        return this._authService.getSignedInUser() != null;
    }

    getSignedInUser() {
        return this._authService.getSignedInUser();
    }

    isAdmin() {
        return this._authService.getSignedInUser().hasRole(Roles.Admin);
    }

    logout() {
        this._authService.logout();
        this._router.navigate(['/']);
    }
}
