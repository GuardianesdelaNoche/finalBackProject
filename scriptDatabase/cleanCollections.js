'use strict';
require('dotenv').config();
const db = require('../lib/connectMongoose');
const Events = require('../models/Events');

removeCollection().catch(err => console.error(err));

module.exports = async function removeCollection() {
    try {
        const { deletedCount } = await Events.deleteMany();
        console.log(`Deleted ${deletedCount} events.`);
        db.close()
    } catch (error) {
        console.log(error);
    }
}
