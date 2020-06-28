require('dotenv').config()
const inquirer = require('inquirer')
const Grinder = require('./classes/Grinder')
const ChainGuard = require('./classes/ChainGuard')

const testAnswers = {
    "ALTER ANGLE":  0,
    'PUSH CHAIN': 1,
    'LOWER GRINDER': 2,
    'LIFT GRINDER': 3,
    'CLAMP CHAIN': 4,
    'RELEASE CHAIN': 5
}

const testMenu = [
    'Alter angle of grinder',
    'Push chain forward',
    'Lower grinder',
    'Lift grinder',
    'Clamp chain',
    'Release Chain'
]

const grinder = new Grinder()
const chainGuard = new ChainGuard()

function setupProgram() {
    while (true) {
        inquirer.prompt(testMenu).then(answer => {
            switch (answer) {
                case testAnswers["ALTER ANGLE"]:
                    grinder.alterAngle()
                    break;
                case testAnswers["PUSH CHAIN"]:
                    chainGuard.pushChain()
                    break;
                case testAnswers["LOWER GRINDER"]:
                    grinder.lower()
                    break;
                case testAnswers["LIFT GRINDER"]:
                    grinder.lift()
                    break;
                case testAnswers["CLAMP CHAIN"]:
                    chainGuard.clampChain()
                    break;
                case testAnswers["RELEASE CHAIN"]:
                    chainGuard.releaseChain()
                    break;
            }        
        })
    }
}

setupProgram()
