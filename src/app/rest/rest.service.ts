import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import * as feathers from 'feathers/client';
import * as rest from 'feathers-rest/client';
import * as hooks from 'feathers-hooks';
import * as auth from 'feathers-authentication-client';
import * as superagent from 'superagent';

@Injectable()
export class RestService {

    private _featherClient;

    constructor() {
        let storage;

        try {
            storage = localStorage;
        } catch (e) {
            console.log('Local storage is not available');
        }

        this._featherClient = feathers()
            .configure(hooks())
            .configure(rest(environment.apiEndpoint).superagent(superagent))
            .configure(auth({
                header: 'Authorization',
                jwtStrategy: 'jwt',
                cookie: 'feathers-jwt',
                storageKey: 'feathers-jwt',
                path: '/authentication', // the server-side authentication service path
                storage: storage // the server-side authentication service path
            }));

        // .configure(feathers.authentication({
        //         header: 'Authorization', // the default authorization header for REST
        //         path: '/authentication', // the server-side authentication service path
        //         jwtStrategy: 'jwt', // the name of the JWT authentication strategy
        //         entity: 'user', // the entity you are authenticating (ie. a users)
        //         service: 'users', // the service to look up the entity
        //         cookie: 'feathers-jwt', // the name of the cookie to parse the JWT from when cookies are enabled server side
        //         storageKey: 'feathers-jwt', // the key to store the accessToken in localstorage or AsyncStorage on React Native
        //         storage: undefined // Passing a WebStorage-compatible object to enable automatic storage on the client.
        //     }));
    }

    getFeatherRestClient() {
        return this._featherClient;
    }

}
