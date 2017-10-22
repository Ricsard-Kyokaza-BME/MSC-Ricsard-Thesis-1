import {Component} from '@angular/core';
import {AuthenticationService} from '../rest/authentication.service';


@Component({
    selector: 'sd-lazy-view',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    private _email: string;
    private _password: string;

    constructor(private _authService: AuthenticationService) {
        this._email = '';
        this._password = '';
    }

    loginLocalStrategy() {
        this._authService.loginLocalStrategy(this._email, this._password);
    }
}
