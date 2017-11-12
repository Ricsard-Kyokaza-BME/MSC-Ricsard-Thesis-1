import {Component, OnInit} from '@angular/core';
import {Message} from '../../../models/message.model';
import {RestService} from '../../rest/rest.service';
import {plainToClass} from 'class-transformer';
import {User} from '../../../models/user.model';
import {AuthenticationService} from '../../rest/authentication.service';

@Component({
    selector: 'sd-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

    messages: Message[];

    constructor(private _authService: AuthenticationService, private _restService: RestService) {
        this.messages = [];
    }

    ngOnInit() {
        Message.find(this._restService, {query: {$limit: 100, to: this._authService.getSignedInUser().id, $populate: 'from'}}).then(
            response => {
                this.messages = plainToClass(Message, response.data);
                this.messages.forEach(message => message.from = <User><any>plainToClass(User, message.from));
            });
    }

}
