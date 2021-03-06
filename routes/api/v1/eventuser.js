var express = require('express');
var router = express.Router();
const Event = require('../../../models/Event');
//const User = require ('../../../models/User');
const jwtAuth = require('../../../lib/jwtAuth');


/* GET owner events */

router.get('/ownevent',jwtAuth, async function(req, res, next) {
  try {
    
    req.query.apiAuthUserId = req.apiAuthUserId;
    req.query.limit || 100;
    req.query.skip || 0;
    
    const {rows} = await Event.findOwnEventsPaginate(req);
    const resultEnd = rows[0];

    const {total,result} = resultEnd;
    const count = total.length?total[0].count:0;

    res.json({ total:count, events: result });
  } catch (error) {
    next(error);
  }
});

/* GET favorite events */

router.get('/favoriteevent',jwtAuth, async function(req, res, next) {
  try {
    
    req.query.apiAuthUserId = req.apiAuthUserId;
    req.query.limit || 100;
    req.query.skip || 0;
    req.query.typeSearch = 'favorite';

    const {rows} = await Event.findFavoriteEventsPaginate(req);
    const resultEnd = rows[0];

    const {total,result} = resultEnd;
    const count = total.length?total[0].count:0;

    res.json({ total:count, events: result });
  } catch (error) {
    next(error);
  }
});


/* GET assistant events */

router.get('/assistant',jwtAuth, async function(req, res, next) {
  try {
    
    req.query.apiAuthUserId = req.apiAuthUserId;
    req.query.limit || 100;
    req.query.skip || 0;
    req.query.typeSearch = 'assistant';

    const {rows} = await Event.findAssistantsEventsPaginate(req);
    const resultEnd = rows[0];

    const {total,result} = resultEnd;
    const count = total.length?total[0].count:0;

    res.json({ total:count , events: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;