'use strict';

const router = require('express').Router();
const Tag = require('../../../models/Tag');

/* GET tags . */
router.get('/', async function (req, res, next) {
    try {
      const result = await Tag.find();
    
      res.json({ tags: result });
  
    } catch (error) {
        // const errorModify = error.toString().split(':')[1].trim();
        // return res.status(500).json({ message: errorModify });
        next(error);
    }
});

router.post('/', async (req, res, next) => {

  try {
    const { name } = req.body;

    const tag = new Tag({name});
  
    // eslint-disable-next-line no-unused-vars
    const saveResult = await tag.save();
   
    res.status(201).json({ result: tag});    
  } catch (error) {
  
    next(error);
  }

});

module.exports = router;

