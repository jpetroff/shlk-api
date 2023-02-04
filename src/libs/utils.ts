import _ from 'underscore'

export function clearURLTracking (url: URL) : URL {
  const trackingParams = [
    'fbclid',
    'utm_source', 'utm_medium', 'utm_content', 'utm_campaign', 'utm_term',
    '_ga', 'dclid', 'gclid', 'msclkid', 'sessionid'
  ]

  trackingParams.forEach( (param) => url.searchParams.delete(param) )
  return url
}

/**
 * Adds protocol https://, clears tracking tags, removes trailing slash
 *
 * @param {string} _url Full URL
 * 
 * @return {string}
 */
export function normalizeURL( _url: string ): string {
  let url = _url.trim()
  const protocolRegex = new RegExp('^https?://')

  if(!protocolRegex.test(url)) url = 'https://'+url

  const URLObj = new URL(url)
  let URLString : string = clearURLTracking(URLObj).toString()
  if(URLString.indexOf('?') == -1) URLString = URLString.replace(/\/$/, '')

  return URLString
}

export const cliColors = {
  red:    `\x1b[1;31m`,
  green:  `\x1b[1;32m`,
  yellow: `\x1b[1;33m`,
  end:    `\x1b[0m`,
}


export function allEmpty(...args:any[]) : boolean {
  if(arguments.length == 0) return false
  if(arguments.length == 1) return !arguments[0]

  return _.reduce(arguments, (prev, curr) => {
    return (!prev) && (!curr)
  })
}

export function sameOrNoOwnerID(_id1: Maybe<string | ObjectId>, _id2: Maybe<string | ObjectId>) : boolean {
  const id1 = _id1 ? _id1.toString() : _id1
  const id2 = _id2 ? _id2.toString() : _id2
  return allEmpty(id1, id2) || id1 == id2
}

export class ExtError extends Error {
  public meta?: AnyObject

  constructor (message?: string, meta?: AnyObject) {
    super(message)

    // assign the error class name in your custom error (as a shortcut)
    this.name = 'Error'

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    // you may also assign additional properties to your error
    this.meta = meta
  }
}