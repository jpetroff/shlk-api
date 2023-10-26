import { getShortlink } from './shortlink.queries'
import _ from 'underscore'
import express from 'express'

function sendDescriptiveRedirect (res: express.Response, result: ShortlinkDocument) {
  const location = _.unescape(result.location)
  res.redirect(302, location)
  res.end()
}

function sendRedirect (res: express.Response, result: ShortlinkDocument) {
  const location = _.unescape(result.location)
  res.redirect(302, location)
  res.end()
}

function sendErrorResponse (res: express.Response, error: Error) {
  res.status(400).send(error.message)
}

export function appRedirect (req: express.Request, res: express.Response) {
  const isDecriptiveUrl = /.*?@.*?/.test(req.params.redirectUrl)

  if(isDecriptiveUrl) {
    const [ userTag , descriptionTag ] = req.params.redirectUrl.split('@')
    getShortlink({
      userTag,
      descriptionTag
    }).then( (result) => {
      if(!result) throw new Error(`Shortlink '/${req.params.redirectUrl}' not found`)
      return sendDescriptiveRedirect(res, result)
    }).catch( (err) => {
      return sendErrorResponse(res, err)
    }) 

  } else {
    const hash = req.params.redirectUrl
    getShortlink({
      hash
    }).then( (result) => {
      if(!result) throw new Error(`Shortlink '/${req.params.redirectUrl}' not found`)
      return sendRedirect(res, result)
    }).catch( (err) => {
      return sendErrorResponse(res, err)
    })

  }
}