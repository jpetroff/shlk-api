import * as _ from 'underscore'
import linkTools from './link.tools'
import prettyBytes from 'pretty-bytes'

type LinkData = {
  location: string
  urlMetadata?: AnyObject
}

class MetadataTools {
  constructor() {}

  getDefaultFavicon( list?: {src: string, sizes?: string}[] ) : {src: string, sizes?: string} {
    if(!list) return { src: '/assets/default-favicon.png', sizes: 'default' }
    return { src: '/assets/default-favicon.png', sizes: 'default' }
  }

  getTitle( shortlink: LinkData ) : string {
    if(!shortlink.urlMetadata) return linkTools.makeDisplayUrl(shortlink.location)

    return  shortlink.urlMetadata.title || 
            shortlink.urlMetadata.og?.title ||
            shortlink.urlMetadata.site_name ||
            shortlink.urlMetadata.og?.site_name ||
            linkTools.makeDisplayUrl(shortlink.location)
  }

  getDescription( shortlink: LinkData ) : string {
    if(!shortlink.urlMetadata) return ''

    const type = shortlink.urlMetadata.type.replace(/;.*$/ig, '').trim()
    if(/html/ig.test(type)) {
      const v1 = (shortlink.urlMetadata.description ||
                  shortlink.urlMetadata.og?.description || 
                  '')
      const v2 =  [
                    shortlink.urlMetadata.og?.type || '',
                    shortlink.urlMetadata.og?.site_name || ''
                  ].join(' · ')
      return v1.trim() || v2.trim() || ''
    }
    if(/image/ig.test(type)) {
      return [
        'Image',
        // ( shortlink.urlMetadata.size? prettyBytes(parseInt(shortlink.urlMetadata.size)) : '' )
        shortlink.urlMetadata.size || ''
      ].join(' · ')
    }
    if(/video/ig.test(type)) {
      return [
        'Video',
        shortlink.urlMetadata.size || ''
      ].join(' · ')
    }
    return ''
  }
}

export default new MetadataTools()
