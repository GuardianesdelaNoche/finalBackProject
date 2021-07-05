'use strict';
//const removeCollection = require('./cleanCollections');


actionDB()

function actionDB() {
    //readLine.emitKeypressEvents(process.stdin);
    console.log('====================================');
    console.log('1- Delete collection events');
    console.log('2- Mock data in collection events');
    console.log('3- Insert data in collection tags');
    console.log('4- Insert data in collection user');
    console.log('5- Do other action');
    console.log('6- finish action');
    console.log('====================================\n');

    const ask = process.stdout.write('What action would you like to do \n');
    
    
    process.stdin.on("data", function(responseUser) {
        let action = responseUser.toString().trim();

        switch (action) {
            case "1":
                console.log('1');
                process.stdout.write('Would like to do other action or finish?\n');
                break;
            default:
                break;
        }

        if (action === "6") {
            process.exit();
        }
       
    });
}