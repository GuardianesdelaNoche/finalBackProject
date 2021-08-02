'use strict'

const mongoose = require('mongoose');
const User = require('../models/User');


async function expressValidateEmail(req) {
    const resultEI={}
    resultEI.resultE_Id = await User.existsEmail(req.body.email,req.apiAuthUserId);
    resultEI.resultE = await User.getUserEmail(req.body.email);
    
    return resultEI
}

module.exports = expressValidateEmail;
