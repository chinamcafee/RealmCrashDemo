import Realm, { BSON, ObjectSchema } from 'realm';

export class Profile extends Realm.Object<Profile> {
  _id!: BSON.ObjectId;
  name!: string;
  profileItems!: Realm.List<ProfileItem>;
  static schema: ObjectSchema = {
    name: 'Profile',
    properties: {
      _id: 'objectId',
      name: {type: 'string', indexed: 'full-text'},
      profileItems: {type: 'list', objectType: 'ProfileItem'},
    },
    primaryKey: '_id',
  };
}

export class ProfileItem extends Realm.Object<ProfileItem> {
  _id!: BSON.ObjectId;
  profileTitle!: string;
  static schema: ObjectSchema = {
    name: 'ProfileItem',
    properties: {
      _id: 'objectId',
      profileTitle: {type: 'string', indexed: 'full-text'},
    }
  };
}