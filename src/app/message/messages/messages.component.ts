import {Component, OnInit} from '@angular/core';
import {Message} from '../../../models/message.model';
import {RestService} from '../../rest/rest.service';
import {plainToClass} from 'class-transformer';
import {User} from '../../../models/user.model';
import {AuthenticationService} from '../../rest/authentication.service';

interface GrouppedMessage {
    groupId: string;
    messages: Message[];
}

@Component({
    selector: 'sd-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

    messages: Message[];
    grouppedMessages: GrouppedMessage[];
    newMessage: Message;
    newMessageContentMap: string[];

    constructor(private _authService: AuthenticationService, private _restService: RestService) {
        this.messages = [];
        this.newMessage = new Message();
        this.newMessageContentMap = [];
        this.grouppedMessages = [];
    }

    ngOnInit() {
        Message.find(this._restService, {
            query: {
                $limit: 100,
                $or: [
                    {to: this._authService.getSignedInUser().id},
                    {from: this._authService.getSignedInUser().id}
                ],
                $populate: ['from', 'to']
            }
        }).then(
            response => {
                this.messages = plainToClass(Message, response.data);
                this.messages.forEach(message => {
                    message.from = <User><any>plainToClass(User, message.from);
                    this.newMessageContentMap[message.from.id] = '';
                });

                this.groupMessages();
            });
    }

    groupMessages() {
        this.messages.forEach(message => {
            this.addMessageToGroup(message);
        });
    }

    addMessageToGroup(message: Message) {
        if ((message.from as User).id === this._authService.getSignedInUser().id) {
            if (!this.grouppedMessageFindByGroupId(message.to + '')) {
                this.grouppedMessages.push({
                    groupId: message.to + '',
                    messages: [message]
                });
            } else {
                this.grouppedMessageFindByGroupId(message.to + '').messages.push(message);
            }
        } else if (!this.grouppedMessageFindByGroupId((message.from as User).id)) {
            this.grouppedMessages.push({
                groupId: (message.from as User).id,
                messages: [message]
            });
        } else {
            this.grouppedMessageFindByGroupId((message.from as User).id).messages.push(message);
        }

        console.log(this.grouppedMessages);
    }

    grouppedMessageFindByGroupId(groupId: string): GrouppedMessage | undefined {
        let returnGrouppedMessage;

        this.grouppedMessages.forEach(grouppedMessage => {
            if (grouppedMessage.groupId === groupId) {
                returnGrouppedMessage = grouppedMessage;
            }
        });

        return returnGrouppedMessage;
    }

    getSignedInUserId() {
        return this._authService.getSignedInUser().id;
    }

    sendReply(userId: string) {
        this.newMessage.content = this.newMessageContentMap[userId];
        this.newMessage.to = userId;

        this.newMessage.create().then(response => {
            Message.findById(this._restService, response['_id'], {query: {$populate: 'from'}})
                .then(realMessageResponse => {
                    const message = <Message><any>plainToClass(Message, realMessageResponse);
                    message.from = <User><any>plainToClass(User, message.from);
                    this.addMessageToGroup(message);
                    this.newMessage = new Message();
                    this.newMessageContentMap[userId] = '';
                });
        });
    }

}
