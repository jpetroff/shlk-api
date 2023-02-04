declare type ResultDoc<T> = import('mongoose').HydratedDocument<T>
declare type QueryType<T> = import('mongoose').QueryWithHelpers<any, T>
declare type ObjectId = import('mongoose').Types.ObjectId

/* 
  [Common] Common query arguments
*/
declare interface QICommon {
  limit?: number
  skip?: number
  sort?: string
  order?: string | number 
  search?: string
}

/*
  [Shortlink] GraphQL interface
*/
declare interface QIShortlink {
  hash: string
  location: string
  descriptor?: {
    userTag?: string
    descriptionTag: string 
  }
  owner?: ObjectId
  urlMetadata?: AnyObject
  siteTitle?: string
  siteDescription?: string
  snooze?: {
    awake: Number
    description?: String
  }
}

/* 
  [Shortlink] MongoDB object representation for query results
  */
declare interface ShortlinkDocument extends QIShortlink {
  _id?: ObjectId
  createdAt?: string
  updatedAt?: string
}

/* 
  [User] GraphQL interface for client User queries
 */
declare interface QIUser {
  name?: Maybe<string>
  userTag?: Maybe<string>
  avatar?: Maybe<string>
}

/* 
  User profile for sending to frontend
 */
declare interface UserProfile {
  email: string

  name?: Maybe<string>
  avatar?: Maybe<string>
  userTag?: Maybe<string>
}

/* 
  User params used internally
 */
declare interface UserObject extends UserProfile {
  id_token?: Maybe<string>
  access_token?: Maybe<string>
  refresh_token?: Maybe<string>
}


/* 
  [User] MongoDB object representation for query results
*/
declare interface UserDocument extends UserObject {
  _id: ObjectId
  createdAt?: string
  updatedAt?: string
}