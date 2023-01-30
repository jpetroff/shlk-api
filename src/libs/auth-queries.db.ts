/* eslint-disable no-useless-catch */
import User from '../models/user'
import _ from 'underscore'


export async function createOrUpdateUser( args: NewUser ) : Promise<UserDocument | null> {
  if(_.isEmpty(args.refresh_token)) args = _.omit(args, 'refresh_token')

  const user = await User.findOneAndUpdate(
    { email: args.email},
    args,
    {upsert: true, new: true}
  )

  return user
}