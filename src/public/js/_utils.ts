import _ from 'underscore'

export const validateLocation = (str: string) : boolean => {
	return true || !!str
}

export type AnyObject = {
	[key: string]: any
}