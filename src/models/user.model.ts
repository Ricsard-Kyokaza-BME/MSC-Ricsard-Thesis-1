import {CRUDEntity} from './CRUDEntity.model';
import {Roles} from './roles.enum';

export class User extends CRUDEntity {
    static serviceName = 'users';

    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    facebookId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id?: string, firstName?: string, lastName?: string, email?: string, roles?: string[], facebookId?: string,
                createdAt?: Date, updatedAt?: Date) {
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles || [Roles.User];
        this.facebookId = facebookId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    }

    hasRole(role: Roles): boolean {
        return (this.roles.indexOf(role) > -1);
    }
}