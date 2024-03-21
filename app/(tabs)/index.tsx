import React, { useCallback, useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Pressable } from 'react-native';
import { BSON } from 'realm';
import { useRealm, useQuery } from '~/realmDB/realmConfig';
import { Profile, ProfileItem } from '~/realmDB/model/Profile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chat, Message, MessageText } from '~/realmDB/model/ChatMessage';
import useChatMessageRepository from '~/realmDB/repository/useChatMessageRepository';
export default function FreeTest() {
    const realm = useRealm();
    const [checked, setChecked] = useState<boolean>(false)

    const [profileName, setProfileName] = useState('');

    const insets = useSafeAreaInsets();

    const addProfile = () => {
        realm.write(() => {
            realm.create(Profile, {
                _id: new BSON.ObjectId(),
                name: profileName,
                profileItems: [
                    {
                        _id: new BSON.ObjectId(),
                        profileTitle: 'item1' + profileName,
                    },
                    {
                        _id: new BSON.ObjectId(),
                        profileTitle: 'item12' + profileName,
                    },
                ]
            });
        });
    };

    const {
        getChatMessageByPage,
        getChatInfoWithLastMessage,
        insertChat,
        insertMessage,
        deleteMessage,
    } = useChatMessageRepository();

    const addChat = () => {
        const chat = {
            chatId: "ttskjlaklwd02-slkjdljg03",
            chatOwner: "ttskjlaklwd02",
            chatTarget: "slkjdljg03",
            creationDate: new Date(),
        };
        insertChat(chat);
    }
    // const addChat = () => {
    //     realm.write(() => {
    //         realm.create(Chat, {
    //             chatId: "ttskjlaklwd02-slkjdljg03",
    //             chatOwner: "ttskjlaklwd02",
    //             chatTarget: "slkjdljg03",
    //             creationDate: new Date(),
    //         });
    //     });
    //     console.log("add chat success =============")
    // };

    const queryChat = () => {
        const result = getChatInfoWithLastMessage("ttskjlaklwd02-slkjdljg03");
        console.log("queryChat result is ==========", JSON.stringify(result))
    }
    const queryChatInfo = useQuery(Chat, chat => {
        return chat.filtered('chatId == $0', "ttskjlaklwd02-slkjdljg03")
    })

    // const queryCharPressed = () => {
    //     queryChat.forEach(chat => {
    //         console.log("queryChat is ===============", JSON.stringify(chat));
    //     });
    // };

    const addChatMessage = () => {

        const message = {
            id: randomString(),
            isSystemMessage: false,
            deliveryDate: new Date(),
            text: {
                content: 'testlalalala' + randomNum(),
                type: 10,
            },
            groupId: "null",
            senderId: "ttskjlaklwd02",
            recipientId: "slkjdljg03",
        }

        insertMessage(queryChatInfo[0], message);
    }
    // const addChatMessage = () => {
    //     let messages = queryChat[0].messages;

    //     realm.write(() => {
    //         messages!.push(realm.create(Message,{
    //             id: randomString(),
    //             isSystemMessage: false,
    //             deliveryDate: new Date(),
    //             text: realm.create(MessageText,{
    //                 content: 'testlalalala'+ randomNum(),
    //                 type: 10,
    //             }),
    //             groupId: "null",
    //             senderId: "ttskjlaklwd02",
    //             recipientId: "slkjdljg03",
    //         }))
    //         console.log("messages push success ===============")
    //     });
    // }

    const deleteMessagePressed = () => {
        deleteMessage("ttskjlaklwd02-slkjdljg03", "9eosxzt2cc");
    }

    // 帮我写一个随机生成15位只包含字符串的的函数
    function randomString() {
        return Math.random().toString(36).substring(2, 15);
    }

    // 帮我写一个随机生成0~20的数字的函数
    function randomNum() {
        return Math.floor(Math.random() * 20);
    }

    const sortedProfiles = useQuery(Profile, profiles => {
        return profiles.filtered('name == $0', profileName);
    }, [profileName]);

    const filterdProfile = sortedProfiles.filtered('name == $0', profileName);


    const addProfileItem = (titleSufix: string) => {
        let list = filterdProfile[0].profileItems;
        realm.write(() => {
            list.push({
                _id: new BSON.ObjectId(),
                profileTitle: 'item1' + titleSufix,
            })
            console.log("list push success ===============")
        }

        );
    }

    const queryProfile = () => {

        filterdProfile.forEach(profile => {
            console.log("sortedProfiles is ===============", JSON.stringify(profile));
        });
    };

    const handleCheckboxPress = () => {
        setChecked(prev => {
            return !prev
        })
    }

    return (
        <View style={{ marginTop: insets.top }}>
            <Text style={{ fontSize: 20 }}>Create/Query</Text>
            <TextInput
                onChangeText={(text) => {
                    setProfileName(text);
                }}
                value={profileName}
                placeholder="Profile name..."
                style={{ fontSize: 30 }}
            />
            <Button
                title="Add Profile"
                onPress={addProfile}
            />
            <Button
                title="Query Profile"
                onPress={queryProfile}
            />
            <Button
                title="Add Profile Item"
                onPress={() => {
                    addProfileItem("lalala")
                }}
            />

            <View style={{ marginTop: 100 }}>
                <Text style={{ fontSize: 20 }}>Create/Query Chat</Text>
                <Button
                    title="Add Chat"
                    onPress={addChat}

                />
                <Button
                    title="Query Chat"
                    onPress={queryChat}
                />
                <Button
                    title="Add MessageText"
                    onPress={addChatMessage}
                />
                <Button
                    title="Delete MessageText"
                    onPress={deleteMessagePressed}
                />

            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    checkbox: {
        width: 64,
        height: 64
    }
})