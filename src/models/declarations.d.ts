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
  id_token?: string | null
  access_token?: string | null
  refresh_token?: string | null
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