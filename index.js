const express = require('express')
const WebSocket = require('ws')
const { v4: uuidv4 } = require('uuid');
const app = express()
const SetupProgram = require('./classes/SetupProgram')

app.use(express.static('public'))

app.listen(3000, () => {
    console.log('Opend port on 3000')
})

const wss = new WebSocket.Server({ port: 8080 })

const setupProgram = new SetupProgram()

const connectedClients = new Map()

wss.on('connection', ws => {
    const clientID = uuidv4()
    connectedClients.set(clientID,ws)
    console.log('Client connected: ', clientID)

    ws.on('message', message => {
        const msg = JSON.parse(message)
        if (msg.hasOwnProperty('command')) {
            handleCommand(msg.command)
        }
    })

    ws.on('close', () => {
        connectedClients.delete(clientID)
        console.log('Client disconnected: ', clientID)
    })
})


function sendMessage(msg) {
    wss.broadcast = (msg) => {
        wss.clients.forEach(function each (client) {
            client.send(msg)
        })
    }
}

async function handleCommand(command) {
    switch (command) {
        case 'LOWER':
            console.log('LOWER')
            sendMessage({ status: 'LOWERING'})
            await setupProgram.lowerGrinder()
            sendMessage({ status: 'RESTING'})
            break;
        case 'LIFT':
            console.log('LIFT')
            sendMessage({ status: 'LIFTING'})
            await setupProgram.liftGrinder()
            sendMessage({ status: 'RESTING'})
            break;
        case 'ALTER ANGLE':
            console.log('ALTER ANGLE')
            sendMessage({ status: 'ALTERING ANGLE'})
            await setupProgram.alterGrinderAngle()
            sendMessage({ status: 'RESTING'})
            break;
        case 'SETUP SEQUENCE':
            console.log('SETUP SEQUENCE')
            sendMessage({ status: 'RUNNING SETUP'})
            await setupProgram.runSetupSequence()
            sendMessage({ status: 'RESTING'})
            break;
        case 'START':
            console.log('START')
            break;
        case 'STOP':
            console.log('STOP')
            break;
    }
}



