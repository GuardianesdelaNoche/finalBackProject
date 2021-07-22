'use strict'

const router = require('express').Router();
const Tag = require('../../../models/Tag');

/* GET tags . */
router.get('/', async function (req, res, next) {
    try {
      const result = await Tag.find();
      
      res.json({ tags: result });
  
    } catch (error) {
        const errorModify = error.toString().split(':')[1].trim();
        return res.status(500).json({ message: errorModify });
    }
})

module.exports = router
