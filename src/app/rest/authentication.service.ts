import {EventEmitter, Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {User} from '../../models/user.model';
import {plainToClass} from 'class-transformer';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthenticationService {

    private _feathersClient;
    loginEvent: EventEmitter<User> = new EventEmitter();
    isLoggedInEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);

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
                this.loginEvent.emit(this.getSignedInUser());
                this.isLoggedInEvent.next(true);
            })
            .catch(err => {
                this.isLoggedInEvent.next(false);
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
            this.isLoggedInEvent.next(true);
        });
    }

    getSignedInUser(): User | undefined {
        return this._feathersClient.get('user');
    }

    updateSignedInUser() {
        User.findById(this._restService, this.getSignedInUser().id)
            .then(user => this._feathersClient.set('user', plainToClass(User, user)));
    }

    logout() {
        this._feathersClient.logout();
        this._feathersClient.set('user', undefined);
    }

}
