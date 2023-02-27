/* eslint-disable no-useless-catch */
import User from '../models/user'
import _ from 'underscore'

export const UserProfileFields : (keyof UserProfile)[] = [ 'email', 'name', 'avatar', 'userTag' ]
export const UserObjectFields : (keyof UserObject)[] = Array().concat(UserProfileFields, [ 'id_token', 'access_token', 'refresh_token' ])

export async function createOrUpdateUser( args: UserObject ) : Promise<ResultDoc<UserDocument> | null> {
  if(_.isEmpty(args.refresh_token)) args = _.omit(args, 'refresh_token')
  if(_.isEmpty(args.name)) args.name = args.email

  const newParams = _.pick(args, (value, key) => {
    return  UserObjectFields.indexOf(key as (keyof UserObject)) != -1 &&
            !_.isEmpty(value)
  })

  const user = await User.findOneAndUpdate(
    { email: args.email},
    newParams,
    {upsert: true, new: true}
  )

  return user
}

export async function getUser(id: string) : Promise<ResultDoc<UserDocument> | null> {
  let loggedUser = await User.findById(id)
  return loggedUser
}