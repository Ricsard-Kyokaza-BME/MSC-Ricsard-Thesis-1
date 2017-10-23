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

    public static findById(restService: RestService, id: String, params?: any): Promise<any> {
        return restService.getFeatherRestClient().service(this.serviceName).get(id, params);
    }

    public static find(restService: RestService, params?: any): Promise<any> {
        return restService.getFeatherRestClient().service(this.serviceName).find(params);
    }

    public create(params?: any): Promise<CRUDEntity> {
        return this._restService.getFeatherRestClient().service(this.getServiceName()).create(this, params);
    }

    public patch(params?: any): Promise<CRUDEntity> {
        return this._restService.getFeatherRestClient().service(this.getServiceName()).patch(this.id, this, params);
    }

    public update(params?: any): Promise<CRUDEntity> {
        return this._restService.getFeatherRestClient().service(this.getServiceName()).update(this.id, this, params);
    }

    public remove(params?: any): Promise<any> {
        return this._restService.getFeatherRestClient().service(this.getServiceName()).remove(this.id, params);
    }

    get id(): string {
        return this._id;
    }

    public getServiceName(): String {
        return this.constructor['serviceName'];
    }
}
