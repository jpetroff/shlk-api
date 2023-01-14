import { GraphQLError } from "graphql"
import { GraphQLClient } from "graphql-request"
import { ClientError } from "graphql-request/dist/types"
import { AnyObject } from "../../js/constants"


export type GracefulErrorType = {
  code: string
  message: string
}

class GracefulError {
  constructor() {}

  private processResponse(err: ClientError) : GracefulErrorType | null {
    const res = err.response
    if(res.errors) {
      return {
        code: String(res.errors[0].extensions.code),
        message: String(res.errors[0].message)
      }
    } else {
      return null
    }
  }

  process(err: Error | ClientError) : GracefulErrorType | null {
    if(err instanceof ClientError) {
      return this.processResponse(err)
    } else if(err instanceof Error) {
      return {
        code: 'APP_ERROR',
        message: err.message
      }
    }

    return null
  }
}

export default new GracefulError()