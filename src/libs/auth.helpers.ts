import { ExtError } from "./utils"

export function authUserId(req: Maybe<Express.Request>) : string {
  if(req?.session?.userId) {
    return req.session.userId
  } else {
    throw new ExtError(
      `You need to log in to use this`,
      { code: 'FORBIDDEN' }
    )
  }
}