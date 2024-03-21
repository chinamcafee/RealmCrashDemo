import { createRealmContext } from "@realm/react";
import Realm from "realm";
import { Profile, ProfileItem } from '~/realmDB/model/Profile';
import { Chat, Message, MessageText } from "./model/ChatMessage";

const config: Realm.Configuration = {
    schema: [Profile, ProfileItem, Chat, Message, MessageText],
    // Increment the 'schemaVersion', since 'age' has been added to the schema.
    // The initial schemaVersion is 0.
    schemaVersion: 0,
    
};
// pass the configuration object with the updated 'schemaVersion' to
// createRealmContext()
export const {
    RealmProvider,
    useRealm,
    useQuery,
    useObject,
} = createRealmContext(config);
