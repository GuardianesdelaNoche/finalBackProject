'use strict';
require('dotenv').config();
const Events = require('../models/Events');

module.exports = async function removeCollection() {
    try {
        const { deletedCount } = await Events.deleteMany();
        console.log(`Deleted ${deletedCount} events.`);
    } catch (error) {
        console.log(error);
    }
}
