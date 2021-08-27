'use strict';

// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Event = require('../models/Event');


async function expressValidateFavorite(req) {
    const resultUF = await Event.existsIdUserFavorite(req.apiAuthUserId, req.body.eventfavorite);


    return resultUF; 
}

module.exports = expressValidateFavorite;