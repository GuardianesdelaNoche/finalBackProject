'use strict';
const User = require('../models/User');

module.exports = async function initUsers() {

    try {
        const { deletedCount } = await User.deleteMany();
        console.log(`Deleted ${deletedCount} users.`);
       
        const users = await User.insertMany([
            {
                username: 'test',
                email: "user@example.com",
                address:'test' ,
                city: 'Barcelona' ,
                postal_code: '08200' ,
                country: 'Spain',
                role: 1,
                password: await User.hashPassword('1234'),
                phone: '900000',
                nickname: 'test',
                image: '',
                created_date: Date.now(),
                my_events: [],
                suscribe_events: [],
                fav_events: []
            }
        ]);
    
        console.log(`Inserted ${users.length} user${users.length > 1 ? 's' : ''}.`)
    } catch (error) {
        console.log(error);
    }
  }
  