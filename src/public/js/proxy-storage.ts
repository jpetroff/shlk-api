import * as _ from 'underscore'

export const proxyStorage = {

  async getItem(key : string) : Promise<string | null> {
    const result = window.localStorage.getItem(key)
    return result || null
  },

  async setItem(key: string, value: string) : Promise<void> {
    window.localStorage.setItem(key, value)
  },

  canUse() {
    if(window.localStorage) return true
    return false
  },

  async getAllItems(parse: boolean = true) : Promise<any[] | string[] | void> {
    let result : string[] = []
    const keys = _.keys(window.localStorage)
    _.each(keys, (key) => {
      const retrievedItem = window.localStorage.getItem(key)
      if (parse) {
        try {
          result.push( { ...JSON.parse(retrievedItem as string), key })
        } catch { /* skip adding elements that cannot be parsed */ }
      } else {
        result.push(retrievedItem as string)
      }
    })
    return result
  },

  async removeItem(key: string) : Promise<void> {
    window.localStorage.removeItem(key)
  }

}

export default proxyStorage