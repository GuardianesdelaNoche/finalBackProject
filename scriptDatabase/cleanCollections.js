'use strict';
require('dotenv').config();
const Event = require('../models/Event');

module.exports = async function removeCollection() {
    try {
        const { deletedCount } = await Event.deleteMany();
        console.log(`Deleted ${deletedCount} event.`);
    } catch (error) {
        console.error(error);
    }
};
