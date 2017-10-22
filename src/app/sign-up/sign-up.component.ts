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

    firstName: string;
    lastName: string;
    email: string;
    password: string;

    constructor(private _restService: RestService, private _router: Router) {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
    }

    signUp() {
        this._restService.getFeatherRestClient().service(User.serviceName).create({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
        }).then(response => {
            this._router.navigate(['/login']);
        });
    }
}
