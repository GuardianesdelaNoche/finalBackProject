'use strict'

const router = require('express').Router()
const Event = require('../../../models/Event')

/* GET events . */
router.get('/', async function (req, res, next) {
  try {
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 50
    const sort = req.query.sort || 'date'
    const includeTotal = true

    const filters = { date: { '$gte': new Date(Date.now())}}
    
    if (req.query.title) {
      filters.title = new RegExp('^' + req.query.title, 'i')
    }
    if (req.query.indoor) {
      filters.indoor = req.query.indoor
    }
   
    const {total, rows} = await Event.list(filters, skip, limit, sort, includeTotal)
    res.json({ total, events: rows })
  } catch (err) { return res.next(err) }
})

module.exports = router