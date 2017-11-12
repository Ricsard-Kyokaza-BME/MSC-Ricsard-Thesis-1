import {CRUDEntity} from './CRUDEntity.model';
import {Category} from './category.model';
import {User} from './user.model';

export class Offer extends CRUDEntity {
    static serviceName = 'offers';

    title: string;
    description: string;
    price: string;
    categories: string[] | Category[];
    owner: string | User;
    images: string[];
    coordinates: number[];
    createdAt: Date;
    updatedAt: Date;

    constructor(id?: string, title?: string, description?: string, price?: string, categories?: string[] | Category[],
                owner?: string | User, images?: string[], coordinates?: number[], createdAt?: Date, updatedAt?: Date) {
        super(id);
        this.title = title;
        this.description = description;
        this.price = price;
        this.categories = categories || [];
        this.owner = owner;
        this.images = images || [];
        this.coordinates = coordinates || [];
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}