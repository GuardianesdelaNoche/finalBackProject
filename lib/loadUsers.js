'use strict';
require('dotenv').config();
// Cargamos el conector a la base de datos y la dejamos a punto de utilizar
require('./connectMongoose');
// cargar el modelo Anuncios

const path = require('path'); 
const { exit, mainModule } = require('process');

// Generar usuarios en Mongo
const User = require('../models/User')

// Generar Tags en Mongo
const Tag = require('../models/Tag')

main().catch(err => console.error(err));
async function main(){
    await initTags();
    await initUsuarios();
}

async function initUsuarios() {
    const { deletedCount } = await User.deleteMany();
    console.log(`Eliminados ${deletedCount} users.`);
  
    const result = await User.insertMany([
      {
        username: 'Usuario 1',
        email: 'pepe@pepe.com',
        password: await User.hashPassword('1234'),
        role: 0,
        nickname: 'PepeGym'
      },
      {
        username: 'Usuario 2',
        email: 'josep@josep.com',
        password: await User.hashPassword('1234'),
        role: 0,
        nickname: 'JoseGym'
      }
    ]);
    console.log(`Insertados ${result.length} user${result.length > 1 ? 's' : ''}.`)
    exit();
  }
  
  async function initTags() {
    const { deletedCount } = await Tag.deleteMany();
    console.log(`Eliminados ${deletedCount} tags.`);
  
    const result = await Tag.insertMany([
      {
        name: 'Taichi al aire libre'
      },
      {
        name: 'Yoga en la naturaleza'
      },
      {
        name: 'Paseos por la montaña'
      },
      {
        name: 'Salidas bicicleta de montaña'
      },
      {
        name: 'Bicicleta carretera'
      }
    ]);
    console.log(`Insertados ${result.length} tags${result.length > 1 ? 's' : ''}.`)
  }