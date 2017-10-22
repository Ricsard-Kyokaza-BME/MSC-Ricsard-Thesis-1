import {Component} from '@angular/core';
import {AuthenticationService} from '../rest/authentication.service';


@Component({
    selector: 'sd-lazy-view',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    email: string;
    password: string;

    constructor(private _authService: AuthenticationService) {
        this.email = '';
        this.password = '';
    }

    loginLocalStrategy() {
        this._authService.loginLocalStrategy(this.email, this.password);
    }
}
