'use strict';

// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Event = require('../models/Event');


async function expressValidateAssistant(req) {
    const resultUA = await Event.existsIdUserAssistant(req.apiAuthUserId, req.body.eventassistants);


    return resultUA; 
}

module.exports = expressValidateAssistant;