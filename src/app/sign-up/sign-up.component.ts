import {Component} from '@angular/core';
import {User} from '../../models/user.model';
import {RestService} from '../rest/rest.service';
import {Router} from '@angular/router';

@Component({
    selector: 'sd-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _password: string;

    constructor(private _restService: RestService, private _router: Router) {
        this._firstName = '';
        this._lastName = '';
        this._email = '';
        this._password = '';
    }

    signUp() {
        this._restService.getFeatherRestClient().service(User.serviceName).create({
            firstName: this._firstName,
            lastName: this._lastName,
            email: this._email,
            password: this._password,
        }).then(response => {
            this._router.navigate(['/login']);
        });
    }
}
