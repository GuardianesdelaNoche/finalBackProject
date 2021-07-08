'use strict'

const router = require('express').Router()
const Event = require('../../../models/Event')

/* GET anuncios page. */
router.get('/', async function (req, res, next) {
  try {
    const skip = parseInt(req.query.start) || 0
    const limit = parseInt(req.query.limit) || 10
    const sort = req.query.sort || 'date'
    const includeTotal = true

    const filters = {}
    /*
    if (req.query.tag) {
      filters.tags = req.query.tag
    }
    if (req.query.venta) {
      filters.venta = req.query.venta
    }
    */
    const {total, rows} = await Event.list(filters, skip, limit, sort, includeTotal)
    res.json({ total, events: rows })
  } catch (err) { return res.next(err) }
})

module.exports = router
