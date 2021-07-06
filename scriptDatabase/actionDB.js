'use strict';
const removeCollection = require('./cleanCollections');
const toMockData = require('./mockData');
const initTags = require('./initTags');
const db = require('../lib/connectMongoose');

actionDB()

function actionDB() {
    try {
        setTimeout(function(){
            //readLine.emitKeypressEvents(process.stdin);
            console.log('====================================');
            console.log('1- Delete collection events');
            console.log('2- Mock data in collection events');
            console.log('3- Insert data in collection tags');
            console.log('4- Insert data in collection user');
            console.log('5- finish action');
            console.log('====================================\n');
            process.stdout.write('What action would you like to do \n');
            
            
            process.stdin.on("data", async function(responseUser) {
                let action = responseUser.toString().trim();
        
                switch (action) {
                    case "1":
                        await removeCollection();
                        db.close()
                        break;
                    case "2":
                        await toMockData();
                        db.close();
                        break;
                    case "3":
                        await initTags();
                        db.close();
                        break;
                    case "4":
                        console.log('action 4');
                        break;
                    case "5":
                        finishProgram();
                        break;
                    default:
                        console.log("Wrong options or is not a number, please select other option action!");
                        break;
                }
                
                if(action >= 1 && action<=4) {
                    process.stdout.write('Would like to do other action or finish?, for finish programa press in your keyboard the number 6\n');
                }
               
            });
            },1000)
    } catch (error) {
        console.log(error);
    }

}

function finishProgram(){
    console.log("Finalizando programa...");
    process.exit();
}