require('dotenv').config( { path: '/home/pi/ChainGrinder/.env' } )
const express = require('express')
const app = express()
const Program = require('./classes/Program')
const { getState, setSettings, setToothsLeft, setTotalNumberOfTooths, setStatus, setLengthGrindingActive } = require('./globals')
const Socket = require('./socket')
const MyEmitter = require('./classes/MyEvent')
const exec = require('child_process').exec;

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
            program.lowerGrinder()
            break;
        case 'LIFT':
            program.liftGrinder()
            break;
        case 'ALTER ANGLE':
            program.alterGrinderAngle()
            break;
        case 'SETUP SEQUENCE':
            program.runSetupSequence()
            break;
        case 'SETTINGS':
            setSettings(msg.settings)
            break;
        case 'NUMBEROFTOOTHS':
			setTotalNumberOfTooths(msg.value)
            break;
        case 'LENGTHGRINDINGACTIVE':
            setLengthGrindingActive(msg.value)
            break;
        case 'START':
            program.startProgram()
            break;
        case 'STOP':
            myEmitter.emitEvent('STOP')
            setStatus('STOP')
            break;
        case 'STARTGRINDER':
            program.startGrinder()
            break;
        case 'STOPGRINDER':
            program.stopGrinder()
            break;
        case 'CLAMPCHAIN': 
            program.clampChain()
            break;
        case 'RELEASECHAIN':
            program.releaseChain()
            break;
        case 'PUSHCHAIN':
            program.pushChain()
            break;
        case 'CHECKLENGTHGRINDING':
            program.checkLengthGrinding()
            break;
        case 'QUITCHECKLENGTHGRINDING':
            program.quitCheckLengthGrinding()
            break;
        case 'SHUTDOWN':
            program.exit()
            exec('shutdown now', function(error, stdout, stderr){ callback(stdout); });
            break;
    }
}



