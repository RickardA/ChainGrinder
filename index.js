require('dotenv').config()
const inquirer = require('inquirer')
const SetupProgram = require('./classes/SetupProgram')

const setupProgram = new SetupProgram()

const testMenu = [{
    type: 'list',
    name: 'testMenu',
    message: 'What do you want to do?',
    choices: [
        'Alter angle of grinder',
        'RED BUTTON',
    ]
}]

async function startSetupMenu() {
    while(true) {
       const answer = await inquirer.prompt(testMenu)

            switch (answer.testMenu) {
                case 'Alter angle of grinder':
                    await setupProgram.alterGrinderAngle()
                    break;
                case 'RED BUTTON':
                    await setupProgram.runSetupSequence()
                    break;
            }        

    }
        
}

startSetupMenu()

process.on('SIGINT', () => {
    setupProgram.exit()
})

setupProgram.on('setupStarted', () => {
    console.log('Setuuuup is started!!')
})

setupProgram.on('setupStopped', () => {
    console.log('Setuuuup is doone!!')
})




