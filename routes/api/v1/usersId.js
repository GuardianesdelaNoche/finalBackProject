'use strict'

var express = require('express');
var router = express.Router();
const jwtAuth = require('../../../lib/jwtAuth');

const User = require('../../../models/User');



//Get any user _id
router.get('/', jwtAuth, async function(req,res,next){
    try {
        const resultUserId = await User.getUser_id()
        return res.status(200).json({result: resultUserId});
    } catch (error) {
        next(error);
    }
});

module.exports = router;