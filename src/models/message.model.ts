import {CRUDEntity} from './CRUDEntity.model';
import {User} from './user.model';

export class Message extends CRUDEntity {
    static serviceName = 'messages';

    from: string | User;
    to: string | User;
    content: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id?: string, from?: string | User, to?: string | User, content?: string, createdAt?: Date, updatedAt?: Date) {
        super(id);
        this.from = from;
        this.to = to;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
