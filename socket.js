const WebSocket = require('ws')
const { v4: uuidv4 } = require('uuid');


const wss = new WebSocket.Server({ port: 8080 })
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