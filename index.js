require('dotenv').config()
const inquirer = require('inquirer')
const Grinder = require('./classes/Grinder')
const ChainGuard = require('./classes/ChainGuard')
const Gpio = require('pigpio').Gpio

const testAnswers = {
    "ALTER ANGLE":  0,
    'PUSH CHAIN': 1,
    'LOWER GRINDER': 2,
    'LIFT GRINDER': 3,
    'CLAMP CHAIN': 4,
    'RELEASE CHAIN': 5
}

const testMenu = [{
    type: 'list',
    name: 'testMenu',
    message: 'What do you want to do?',
    choices: [
        'Alter angle of grinder',
        'Push chain forward',
        'Lower grinder',
        'Lift grinder',
        'Clamp chain',
        'Release Chain'
    ]
}]

const grinder = new Grinder()
const chainGuard = new ChainGuard()

async function setupProgram() {
    while(true) {
       const answer = await inquirer.prompt(testMenu)

            switch (answer.testMenu) {
                case 'Alter angle of grinder':
                    grinder.alterAngle()
                    break;
                case 'Push chain forward':
                    chainGuard.pushChain()
                    break;
                case 'Lower grinder':
                    grinder.lower()
                    break;
                case 'Lift grinder':
                    grinder.lift()
                    break;
                case 'Clamp chain':
                    chainGuard.clampChain()
                    break;
                case 'Release Chain':
                    chainGuard.releaseChain()
                    break;
            }        

    }
        
}

setupProgram()


const pushChainInput = new Gpio(process.env.CHAINGUARD_PUSH_INPUT_PIN,Gpio.INPUT)

pushChainInput.on('alert', (level,tick) => {
    if(level == 1) {
        chainGuard.moveBackPusher()
    }
})