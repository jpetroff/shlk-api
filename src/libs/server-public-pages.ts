import { ShortlinkDocument } from '../models/shortlink'
import { Response } from 'express'
import _ from 'underscore'

export function sendDescriptiveRedirect (res: Response, result: ShortlinkDocument) {
	const location = _.unescape(result.location)
	res.redirect(302, location)
	res.end()
}

export function sendRedirect (res: Response, result: ShortlinkDocument) {
	const location = _.unescape(result.location)
	res.redirect(302, location)
	res.end()
}

export function sendErrorResponse (res: Response, error: Error) {
	res.status(400).send(error.message)
}