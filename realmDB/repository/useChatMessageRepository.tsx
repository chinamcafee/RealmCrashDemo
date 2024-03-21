import Realm, { BSON, UpdateMode } from 'realm';
import { useRealm, useQuery } from '~/realmDB/realmConfig';
import { Profile, ProfileItem } from '~/realmDB/model/Profile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chat, Message, MessageText } from '~/realmDB/model/ChatMessage';
import { useObject } from '@realm/react';
import { ChatProps,MessageProps } from "~/types"

// interface ChatProps {
//     chatId: string;
//     chatOwner: string;
//     chatTarget: string;
//     creationDate: Date;
//     messages?: MessageProps;
// }

// interface MessageProps {
//     id: string;
//     isSystemMessage?: boolean;
//     deliveryDate?: Date;
//     text: MessageTextProps;
//     senderId?: string;
//     groupId?: string;
//     recipientId?: string;
// }

// interface MessageTextProps {
//     content?: string;
//     type: number;  // 0-系统消息，10-普通文本消息 11-普通傻瓜尬聊文本消息 12-增强版傻瓜尬聊文本消息 20-普通图片消息 30-普通音频消息
// }
export default function useChatMessageRepository() {
    const realm = useRealm();

    const getChatInfoWithLastMessage = (chatId: string) => {
        const chat = realm.objectForPrimaryKey(Chat, chatId);
        if (!chat) {
            return null;
        }

        const message = chat.messages?.sorted('deliveryDate', true).slice(0, 1);


        let messages: Message[] = [];

        message?.forEach((msg: Message) => {
            if (msg) {
                messages.push(msg);
            }
        })
        const result = {
            chatId: chat.chatId,
            chatOwner: chat.chatOwner,
            chatTarget: chat.chatTarget,
            messages: messages,
            creationDate: chat.creationDate
        }


        return result;

    }
    const getChatMessageByPage = (chatId: string, startDate: Date, pageSize: number) => {
        const chat = realm.objectForPrimaryKey(Chat, chatId);
        if (!chat) {
            return [];
        }

        const messages = chat.messages?.sorted('deliveryDate', true);

        return messages?.filtered('deliveryDate <= $0 LIMIT ($1)', startDate, pageSize);
    }

    const insertChat = (chat: ChatProps) => {
        realm.write(() => {
            return realm.create(Chat,
                {
                    chatId: chat.chatId,
                    chatOwner: chat.chatOwner,
                    chatTarget: chat.chatTarget,
                    creationDate: chat.creationDate,
                }, UpdateMode.All);
        });
        console.log("insertChat success ============", chat.chatId)
    }

    const insertMessage = (chat: Chat, message: MessageProps) => {

        let messages = chat.messages;
        realm.write(() => {
            messages!.push(realm.create(Message, {
                id: message.id,
                isSystemMessage: message.isSystemMessage,
                deliveryDate: message.deliveryDate,
                text: {
                    content: message.text.content,
                    type: message.text.type,
                } as MessageText,
                groupId: "null",
                senderId: message.senderId,
                recipientId: message.recipientId,
            }))
        });

        console.log("inserMessage success ============", message.id)
    }

    const deleteMessage = (chatId: string, messageId: string) => {
        // realm.write(() => {
        const chat = realm.objectForPrimaryKey(Chat, chatId);

        const messages = chat?.messages?.filtered('id == $0', messageId);

        console.log("message is ", JSON.stringify(messages))

        if (messages) {
            realm.write(() => {
                messages!.filtered('id == $0', messageId).forEach((msg: Message) => {
                    realm.delete(msg);
                })
            })
            console.log("deleteMessage success ============", messageId)
        }

    }

    return {
        getChatMessageByPage,
        getChatInfoWithLastMessage,
        insertChat,
        insertMessage,
        deleteMessage,
    }
}