'use strict';
require('dotenv').config();
const db = require('../lib/connectMongoose');

const faker = require('faker');
const Events = require('../models/Events');

initDB().catch(err => console.error(err));

 async function initDB(){
    try {
        
        for (let index = 0; index <= 10; index++) {
            const newEvent = new Events({
                 title: faker.name.title(),
                 description: faker.lorem.paragraph() ,
                 price: faker.commerce.price(),
                 max_places: faker.random.number(1,25),
                 photo: faker.image.image(),
                 indoor: faker.random.boolean(),
                 tags: faker.random.arrayElement()
            });
        
            await newEvent.save();
        }    
          
            db.close()
            console.log('done')
    } catch (error) {
        console.log(error);
    }

};