const express = require('express')
const app = express()
const SetupProgram = require('./classes/SetupProgram')
const Program = require('./classes/Program')
const { getState, setSettings, setToothsLeft, setTotalNumberOfTooths, setStatus } = require('./globals')
const Socket = require('./socket')

app.use(express.static('public'))

app.listen(3000, () => {
    console.log('Opend port on 3000')
})


const socket = new Socket()
const setupProgram = new SetupProgram()
const program = new Program()

socket.on('message',(msg) => {
    handleCommand(msg)
})


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
        case 'NUMBEROFTOOTHS':
			setTotalNumberOfTooths(msg.value)
        break;
        case 'START':
            console.log('START')
            program.startProgram()
            break;
        case 'STOP':
            console.log('STOP')
            setStatus('STOP')
            break;
    }
}



