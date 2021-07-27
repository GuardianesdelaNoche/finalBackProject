'use strict';
const removeCollection = require('./cleanCollections');
const toMockData = require('./mockData');
const initTags = require('./initTags');
const initUsers = require('./initUser')
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
            console.log('5- Force finish the program');
            process.stdout.write('What action would you like to do? \n');
            
            
            process.stdin.on("data", async function(responseUser) {
                let action = responseUser.toString().trim();
        
                switch (action) {
                    case "1":
                        await removeCollection();
                        db.close()
                        finishProgram();
                        break;
                    case "2":
                        await toMockData();
                        db.close();
                        finishProgram();
                        break;
                    case "3":
                        await initTags();
                        db.close();
                        finishProgram();
                        break;
                    case "4":
                        await initUsers();
                        db.close();
                        finishProgram();
                        break;
                    case "5":
                        forceFinishProgram();
                        break;
                    default:
                        console.log("Wrong options or is not a number, please select other action option!");
                        break;
                }
            });
            },1000)
    } catch (error) {
        console.log(error);
    }

}

function finishProgram(){
    console.log("If would like to do other option please run this command: npm run actionDB in root project");
    console.log("Finalizando programa...");
    process.exit();
}

function forceFinishProgram(){
    console.log("Finalizando programa...");
    process.exit();
}