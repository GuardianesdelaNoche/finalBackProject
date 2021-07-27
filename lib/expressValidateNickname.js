'use strict'

const mongoose = require('mongoose');
const User = require('../models/User');


async function expressValidateNickname(req) {
    const resultNI={}
    resultNI.resultN_Id = await User.existsNickNameId(req.body.nickname,req.apiAuthUserId);
    resultNI.resultN = await User.existsNickName(req.body.nickname);
    console.log('Llegado a validate2',resultNI)
    return resultNI
}

module.exports = expressValidateNickname;
