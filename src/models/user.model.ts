import {CRUDEntity} from './CRUDEntity.model';

export class User extends CRUDEntity {
    static serviceName = 'users';

    firstName: string;
    lastName: string;
    email: string;
    facebookId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, firstName: string, lastName: string, email: string, facebookId: string, createdAt: Date, updatedAt: Date) {
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.facebookId = facebookId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }
}