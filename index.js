require('dotenv').config()
const inquirer = require('inquirer')
const Grinder = require('./classes/Grinder')
const ChainGuard = require('./classes/ChainGuard')
const Gpio = require('pigpio').Gpio

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
        'Release Chain',
        'Start grinder',
        'Turn off grinder'
    ]
}]

const grinder = new Grinder()
const chainGuard = new ChainGuard()

const pushChainInput = new Gpio(process.env.CHAINGUARD_PUSH_INPUT_PIN,{mode: Gpio.INPUT, alert: true})
const grinderInput = new Gpio(process.env.GRINDER_LOWERED_INPUT,{mode: Gpio.INPUT, alert: true})

async function setupProgram() {
    pushChainInput.on('alert', (level,tick) => {
        if(level == 1 && chainGuard.isPushed()) {
            console.log('something happend')
            chainGuard.moveBackPusher()
        }
    })

    grinderInput.on('alert',(level,tick) => {
        if(level == 1 && !grinder.liftTimerIsStarted) {
            grinder.startLiftTimer()
        }
    })



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
                case 'Start grinder':
                    grinder.turnOn()
                    break;
                case 'Turn off grinder':
                    grinder.turnOff()
                    break;
            }        

    }
        
}

setupProgram()




