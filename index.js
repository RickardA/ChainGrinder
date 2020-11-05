const express = require('express')
const WebSocket = require('ws')
const { v4: uuidv4 } = require('uuid');
const app = express()
const SetupProgram = require('./classes/SetupProgram')
const { getState, setSettings } = require('./globals')

app.use(express.static('public'))

app.listen(3000, () => {
    console.log('Opend port on 3000')
})

const wss = new WebSocket.Server({ port: 8080 })

const setupProgram = new SetupProgram()

const connectedClients = []

wss.on('connection', ws => {
    const clientID = uuidv4()
    connectedClients.push({clientID,ws})
    console.log('Client connected: ', clientID)
    sendMessageToClient(getState(),clientID)

    ws.on('message', message => {
        const msg = JSON.parse(message)
        if (msg.hasOwnProperty('command')) {
            handleCommand(msg)
        }
    })

    ws.on('close', () => {
        connectedClients.delete(clientID)
        console.log('Client disconnected: ', clientID)
    })
})

function sendMessageToClient(msg,client) {
    wss.broadcast = (msg) => {
        client  = connectedClients.filter(client => client.clientID === client)[0]
        client.send(msg)
    }
}


function sendMessage(msg) {
    wss.broadcast = (msg) => {
        wss.clients.forEach(function each (client) {
            client.send(msg)
        })
    }
}

module.exports = { sendMessage }

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



