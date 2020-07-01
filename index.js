require('dotenv').config()
const inquirer = require('inquirer')
const Program = require('./classes/Program')

const program = new Program()

const testMenu = [{
    type: 'list',
    name: 'testMenu',
    message: 'What do you want to do?',
    choices: [
        'Alter angle of grinder',
        'RED BUTTON',
    ]
}]

async function setupProgram() {
    while(true) {
       const answer = await inquirer.prompt(testMenu)

            switch (answer.testMenu) {
                case 'Alter angle of grinder':
                    await program.alterGrinderAngle()
                    break;
                case 'RED BUTTON':
                    await program.runSetupSequence()
                    break;
            }        

    }
        
}

setupProgram()




