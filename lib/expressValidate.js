'use strict'

const mongoose = require('mongoose');
const { validate } = require('../models/Event');
var Schema = mongoose.Schema;
const Event = require('../models/Event');
const User = require('../models/User');


const expressValidate = async (req) =>{
    const resultEI={}
    resultEI.resultE_Id = await User.existsEmail(req.body.email,req.apiAuthUserId);
    resultEI.resutlE = await User.getUserEmail(req.body.email);
    return resultEI
}

module.exports.expressValidate = expressValidate;
