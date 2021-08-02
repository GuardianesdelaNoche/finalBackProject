'use strict'

const mongoose = require('mongoose');
const Event = require('../models/Event');


async function expressValidateFavorite(req) {
    console.log('Active User un expressValidateFavorite ', req.body.idActiveUser)
    const resultUF = await Event.existsIdUserFavorite(req.apiAuthUserId, req.body._id_favorite);


    return resultUF 
}

module.exports = expressValidateFavorite;