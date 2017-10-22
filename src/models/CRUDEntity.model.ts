import {RestService} from '../app/rest/rest.service';
import {ReflectiveInjector} from '@angular/core';

export class CRUDEntity {
    static serviceName: string;

    private _id: string;
    private _restService: RestService;

    constructor(id?: string) {
        this._id = id;
        const injector = ReflectiveInjector.resolveAndCreate([RestService]);
        this._restService = injector.get(RestService);
    }

    public static findById(restService: RestService, id: String): Promise<any> {
        return restService.getFeatherRestClient().service(this.serviceName).get(id);
    }

    public create(): Promise<any> {
        return this._restService.getFeatherRestClient().service(this.getServiceName()).create(this);
    }

    public patch(): Promise<any> {
        return this._restService.getFeatherRestClient().service(this.getServiceName()).patch(this.id, this);
    }

    public update(): Promise<any> {
        return this._restService.getFeatherRestClient().service(this.getServiceName()).update(this.id, this);
    }

    public remove(): Promise<any> {
        return this._restService.getFeatherRestClient().service(this.getServiceName()).remove(this.id);
    }

    get id(): string {
        return this._id;
    }

    public getServiceName(): String {
        return this.constructor['serviceName'];
    }
}