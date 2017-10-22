import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {User} from '../../models/user.model';
import {plainToClass} from 'class-transformer';
import {Router} from '@angular/router';

@Injectable()
export class AuthenticationService {

    private _feathersClient;

    constructor(private _restService: RestService, private _router: Router) {
        this._feathersClient = _restService.getFeatherRestClient();

        this._feathersClient.passport.getJWT()
            .then(accessToken => {
                return accessToken != null ? this._feathersClient.passport.verifyJWT(accessToken) : Promise.reject('Not authenticated');
            })
            .then(payload => {
                return User.findById(this._restService, payload.userId);
            })
            .then(user => {
                this._feathersClient.set('user', plainToClass(User, user));
                console.log('User', this.getSignedInUser());
            })
            .catch(err => {
                console.log(err);
            });
    }

    loginLocalStrategy(email: string, password: string) {
        this._feathersClient.authenticate({
            strategy: 'local',
            email: email,
            password: password
        }).then(response => {
            /* make authenticated requests here */
            return this._feathersClient.passport.verifyJWT(response.accessToken);
        }).then(payload => {
            return User.findById(this._restService, payload.userId);
        }).then(user => {
            this._feathersClient.set('user', plainToClass(User, user));
            console.log('User', this.getSignedInUser());
            this._router.navigate(['/']);
        });
    }

    getSignedInUser(): User | undefined {
        return this._feathersClient.get('user');
    }

    logout() {
        this._feathersClient.logout();
        this._feathersClient.set('user', undefined);
    }

}
