var express = require('express');
var router = express.Router();
const Event = require('../../../models/Event');
const User = require ('../../../models/User');
const jwtAuth = require('../../../lib/jwtAuth');


router.get('/ownevent',jwtAuth, async function(req, res, next) {
  try {
    
    req.query.apiAuthUserId = req.apiAuthUserId;
    req.query.limit || 100
    req.query.skip || 0
    req.query.sort
    req.query.active

    const {rows} = await Event.findOwnEventsPaginate(req)
    const resultEnd = rows[0];

    const {total,result} = resultEnd;
    const count = total.length?total[0]:0;

    res.json({ total:count, events_own: result })
  } catch (error) {
    const errorModify = error.toString().split(':')[1].trim();
    return res.status(500).json({ message: errorModify });
  }
});

/* GET favorite events */
router.get('/favoriteevent',jwtAuth, async function(req, res, next) {
  try {
    
    req.query.apiAuthUserId = req.apiAuthUserId;
    req.query.limit || 100
    req.query.skip || 0
    req.query.sort
    req.query.active
    req.query.long
    req.query.lat
    req.query.distance_m
    req.query.TypeEvent = 'favorte'

    const {rows} = await Event.findFavoriteEventsPaginate(req)
    const resultEnd = rows[0];

    const {total,result} = resultEnd;
    const count = total.length?total[0]:0;

    res.json({ total:count, events_favorites: result })
  } catch (error) {
    const errorModify = error.toString().split(':')[1].trim();
    return res.status(500).json({ message: errorModify });
  }
});

router.get('/assistant',jwtAuth, async function(req, res, next) {
  try {
    
    req.query.apiAuthUserId = req.apiAuthUserId;
    req.query.limit || 100
    req.query.skip || 0
    req.query.sort
    req.query.active
    req.query.long
    req.query.lat
    req.query.distance_m
    req.query.TypeEvent = 'assistant'

    const {rows} = await Event.findAssistantsEventsPaginate(req)
    const resultEnd = rows[0];

    const {total,result} = resultEnd;
    const count = total.length?total[0]:0;

    res.json({ total:count, events_assistants: result })
  } catch (error) {
    const errorModify = error.toString().split(':')[1].trim();
    return res.status(500).json({ message: errorModify });
  }
});












/*
router.put('/add-fav-events', async function(req, res, next) {
    try {
      const {idUser, idEvent} = req.body;
      console.log(idUser, idEvent);
      const addFavorite = await User.addFavEvents(idUser, idEvent)    
      res.status(201).json({result:addFavorite})
    } catch (error) {
      const errorModify = error.toString().split(':')[1].trim();
      return res.status(500).json({ message: error });
    }
});


router.put('/add-events', async function(req, res, next) {
    try {
      const {idUser, idEvent} = req.body;
      console.log(idUser, idEvent);
      const addFavorite = await Event.add_id_favorite(idUser, idEvent)    
      res.status(201).json({result:addFavorite})
    } catch (error) {
      const errorModify = error.toString().split(':')[1].trim();
      return res.status(500).json({ message: error });
    }
});

router.put('/add-owner', async function(req, res, next) {
    try {
      const {idUser, idEvent} = req.body;
      console.log(idUser, idEvent);
      const addFavorite = await Event.add_id_owner(idUser, idEvent)    
      res.status(201).json({result:addFavorite})
    } catch (error) {
      const errorModify = error.toString().split(':')[1].trim();
      return res.status(500).json({ message: error });
    }
});*/
module.exports = router;