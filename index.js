const express = require('express')
const app = express()
const SetupProgram = require('./classes/SetupProgram')
const { getState, setSettings } = require('./globals')

app.use(express.static('public'))

app.listen(3000, () => {
    console.log('Opend port on 3000')
})



const setupProgram = new SetupProgram()



async function handleCommand(msg) {
    switch (msg.command) {
        case 'LOWER':
            console.log('LOWER')
            await setupProgram.lowerGrinder()
            break;
        case 'LIFT':
            console.log('LIFT')
            await setupProgram.liftGrinder()
            break;
        case 'ALTER ANGLE':
            console.log('ALTER ANGLE')
            await setupProgram.alterGrinderAngle()
            break;
        case 'SETUP SEQUENCE':
            console.log('SETUP SEQUENCE')
            await setupProgram.runSetupSequence()
            break;
        case 'SETTINGS':
            console.log('SETTINGS: ',msg.settings)
            setSettings(msg.settings)
        case 'START':
            console.log('START')
            break;
        case 'STOP':
            console.log('STOP')
            break;
        case 'STATUS':
            sendMessage(getState())
            break;
    }
}



