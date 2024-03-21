import Realm, { BSON, ObjectSchema } from 'realm';

export class Chat extends Realm.Object<Chat> {
    chatId!: string;
    chatOwner!: string;
    chatTarget!: string;
    messages?: Realm.List<Message>;
    creationDate?: Date;
    static schema: ObjectSchema = {
        name: 'Chat',
        properties: {
            chatId: { type: 'string', indexed: true },
            chatOwner: 'string',
            chatTarget: 'string',
            messages: { type: 'list', objectType: 'Message'},
            creationDate: 'date',
        },
        primaryKey: 'chatId',
    };
}

export class Message extends Realm.Object<Message> {
    id!: string;
    isSystemMessage?: boolean;
    deliveryDate?: Date;
    text!: MessageText;
    senderId?: string;
    groupId?: string;
    recipientId?: string;
    static schema: ObjectSchema = {
        name: 'Message',
        properties: {
            id: { type: 'string', indexed: true },
            isSystemMessage: 'bool',
            deliveryDate: 'date',
            text: 'MessageText?',
            senderId: 'string',
            groupId: 'string',
            recipientId: 'string'
        },
    };
}

 
export class MessageText extends Realm.Object<MessageText> {
    content?: string;
    type!: number;  // 0-系统消息，10-普通文本消息 11-普通傻瓜尬聊文本消息 12-增强版傻瓜尬聊文本消息 20-普通图片消息 30-普通音频消息
    static schema: ObjectSchema = {
        name: 'MessageText',
        properties: {
            content: { type: 'string', indexed: 'full-text'},
            type: 'int'
        },
    };
}