import {CRUDEntity} from './CRUDEntity.model';

export class Category extends CRUDEntity {
    static serviceName = 'categories';

    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id?: string, name?: string, description?: string, createdAt?: Date, updatedAt?: Date) {
        super(id);
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
