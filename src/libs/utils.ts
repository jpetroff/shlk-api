import _ from 'underscore'

export function sanitizeMongo( dirtyData: string | undefined): string;
export function sanitizeMongo( dirtyData: { [key: string]: any } | undefined): { [key: string]: any };
export function sanitizeMongo( dirtyData: string | { [key: string]: any } | undefined) {
  if (dirtyData instanceof Object) {
    for (const key in dirtyData) {
      if (/^\$/.test(key)) {
        delete dirtyData[key];
      } else {
        sanitizeMongo(dirtyData[key]);
      }
    }
  } else if (_.isString(dirtyData)) {
		dirtyData = dirtyData.replace(/[${}]/ig, '')
	}
  return dirtyData;
}

export function clearURLTracking (url: URL) : URL {
  const trackingParams = [
    'fbclid',
    'utm_source', 'utm_medium', 'utm_content', 'utm_campaign', 'utm_term',
    '_ga', 'dclid', 'gclid', 'msclkid', 'sessionid'
  ]

  trackingParams.forEach( (param) => url.searchParams.delete(param) )
  return url
}

export function prepareURL( _url: string ): string {
  let url = _url.trim()
  const protocolRegex = new RegExp('^https?://')

  if(!protocolRegex.test(url)) url = 'https://'+url

  const URLObj = new URL(url)
  let URLString : string = clearURLTracking(URLObj).toString()
  if(URLString.indexOf('?') == -1) URLString = URLString.replace(/\/$/, '')

  return URLString
}