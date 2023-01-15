import * as _ from 'underscore'
import proxyStorage from './proxy-storage'
import linkTools from './url-tools'

export type ShortlinkLocal = {
  hash?: string,
  url: string,
  userTag?: string,
  descriptionTag?: string
}

export type ShortlinkLocalStorage = ShortlinkLocal & {
  createdAt: string
}

class LocalStorageLinkCache {
   private dateThreshold : Date

  constructor() {
    const _now = new Date()
    this.dateThreshold = new Date(_now.setMonth(_now.getMonth() - 1))
    _.defer(this.purgeOutdatedShortlinks.bind(this))
  }

  private checkShortlinkType(object: any) {
    return (
      _.isObject(object) && 
      !_.isEmpty(object) && 
      _.keys(object).includes('url')
    )
  }

  private async purgeOutdatedShortlinks() {
    console.log('Purge cache threshold: ', this.dateThreshold.toLocaleDateString())
    const items = await proxyStorage.getAllItems()
    if(!items) return

    const forcePurge = linkTools.queryUrlSearchParams(['purge'], window.location.search)
    console.log(forcePurge)

    _.each(items, (item) => {
      if(!this.checkShortlinkType(item) || !item.createdAt) return

      if(
        this.dateThreshold.valueOf() > (new Date(item.createdAt).valueOf()) ||
        forcePurge[0] == 'true'
      ) {
        console.log(`Item created at ${(new Date(item.createdAt)).toLocaleString()} with key ${item.key} removed`)
        proxyStorage.removeItem(item.key)
      }
    })

    if(forcePurge[0] == 'true') {
      let _modifiedSearch = new URLSearchParams(window.location.search)
      _modifiedSearch.delete('purge')
      console.log(_modifiedSearch)
      window.location.search = _modifiedSearch.toString()
    }
  }

  public storeShortlink( args: ShortlinkLocal) : boolean {
    if (!proxyStorage.canUse()) return false

    const urlKey = encodeURI(args.url)
    const storageItem : ShortlinkLocalStorage = {
      ...args,
      createdAt: (new Date()).toISOString()
    }
    proxyStorage.setItem(urlKey, JSON.stringify(storageItem)).catch((err) => {console.error(err)})
    return true
  }

  public async checkShortlinkCache( args: ShortlinkLocal) : Promise<ShortlinkLocalStorage | null> {
    if (!proxyStorage.canUse()) return null

    const urlKey = encodeURI(args.url)
    const existingShortlink = await proxyStorage.getItem(urlKey)
    if(existingShortlink != null) {
      return JSON.parse(existingShortlink)
    } else {
      return null
    }
  }

  public async getAll(args: {
    sortByDate?: boolean
    clearThreshold?: Date,
    limit?: number
  }) : Promise<ShortlinkLocalStorage[] | null> {
    const storageContent = await proxyStorage.getAllItems(true)
    if(!storageContent) return null
    let result : ShortlinkLocalStorage[] = []
    _.each(storageContent, (item) => {
      if(
        this.checkShortlinkType(item)
      ) {
        result.push(item as ShortlinkLocalStorage)
      }
    })

    if(args.sortByDate) {
      result = _.sortBy(result, (item) => {
        return Date.now() - (new Date(item.createdAt)).valueOf()
      })
    }
    if(args.clearThreshold) {
      const cmpValue = new Date(args.clearThreshold).valueOf()
      result = _.reject(result, (item) => {
        return new Date(item.createdAt).valueOf() < cmpValue
      })
    }
    if(args.limit) return _.first(result, args.limit)
    return result
  }
}

export default new LocalStorageLinkCache()