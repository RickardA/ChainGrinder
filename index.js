require('dotenv').config()
const express = require('express')
const app = express()
const Program = require('./classes/Program')
const { getState, setSettings, setToothsLeft, setTotalNumberOfTooths, setStatus } = require('./globals')
const Socket = require('./socket')
const MyEmitter = require('./classes/MyEvent')

const myEmitter = new MyEmitter()

app.use(express.static('public'))

app.listen(3000, () => {
    console.log('Opend port on 3000')
})


const socket = new Socket()
const program = new Program()

socket.on('message',(msg) => {
    handleCommand(msg)
})

process.on('SIGINT', () => {
	console.log('Do things before exit')
	program.exit()
	process.exit()
})


async function handleCommand(msg) {
    switch (msg.command) {
        case 'LOWER':
            console.log('LOWER')
            await program.lowerGrinder()
            break;
        case 'LIFT':
            console.log('LIFT')
            await program.liftGrinder()
            break;
        case 'ALTER ANGLE':
            console.log('ALTER ANGLE')
            await program.alterGrinderAngle()
            break;
        case 'SETUP SEQUENCE':
            console.log('SETUP SEQUENCE')
            await program.runSetupSequence()
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
            myEmitter.emitEvent('STOP')
            setStatus('STOP')
            break;
    }
}



