'use strict'

const mongoose = require('mongoose');
const User = require('../models/User');


async function expressValidateUsername(req) {
    const resultEI={}
    resultEI.resultU_Id = await User.existsUserNameId(req.body.username,req.apiAuthUserId);
    resultEI.resultU = await User.existsUserName(req.body.username);

    return resultEI 
}

module.exports = expressValidateUsername;
