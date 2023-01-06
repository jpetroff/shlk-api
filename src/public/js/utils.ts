import _ from 'underscore'
import constants from './constants'

export function validateURL(str: string) : boolean {
	return constants.regexWeburl.test(str)
}

export function modifyURLSlug (str: string) : string {
	str = str.replace(/[^a-z0-9\s-]/ig, '')
	// str = str.replace(/\s+/ig, ' ').trim()
	str = str.replace(/\s/ig, '-')
	return str
}

export function testShortcutPasteWithKeyboard () : boolean {
  return !(Modernizr.touchevents && Modernizr.mq(constants.MediaQueries.mobile))
}