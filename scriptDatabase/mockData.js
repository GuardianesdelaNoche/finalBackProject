'use strict';
require('dotenv').config();
const faker = require('faker');
const Events = require('../models/Events');

 module.exports = async function toMockData(){
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
            console.log('done mock')
    } catch (error) {
        console.log(error);
    }

};