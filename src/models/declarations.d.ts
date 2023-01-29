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
}

/* 
  [Shortlink] MongoDB object representation for query results
  */
declare interface ShortlinkDocument extends QIShortlink {
  _id?: string
  createdAt?: string
  updatedAt?: string
}

/* 
  [User] GraphQL interface for client User queries
 */
declare interface QIUser {
  name?: string
  email: string
  userTag?: string
}

/* 

 */
declare interface NewUser {
  email: string
  name: string
  id_token?: string
  access_token?: string
  refresh_token?: string
}

/* 
  [User] MongoDB object representation for query results
*/
declare interface UserDocument extends NewUser {
  _id: string
  userTag?: string
  createdAt?: string
  updatedAt?: string
}