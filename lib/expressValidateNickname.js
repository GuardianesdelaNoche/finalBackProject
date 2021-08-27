'use strict';

// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const User = require('../models/User');


async function expressValidateNickname(req) {
    const resultNI={};
    resultNI.resultN_Id = await User.existsNickNameId(req.body.nickname,req.apiAuthUserId);
    resultNI.resultN = await User.existsNickName(req.body.nickname);
    
    return resultNI;
}

module.exports = expressValidateNickname;
