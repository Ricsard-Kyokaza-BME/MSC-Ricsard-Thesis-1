import {Injectable} from '@angular/core';
import {default as feathers} from 'feathers-client';
import * as rest from 'feathers-rest/client';
import * as superagent from 'superagent';
import {environment} from '../../environments/environment';

@Injectable()
export class RestService {

    private _featherClient;

    constructor() {
        this._featherClient = feathers()
            .configure(feathers.hooks())
            .configure(rest(environment.apiEndpoint).superagent(superagent))
            .configure(feathers.authentication({
                path: '/authentication', // the server-side authentication service path
                storage: localStorage // the server-side authentication service path
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
