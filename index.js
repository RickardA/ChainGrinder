const express = require('express')
const WebSocket = require('ws')
const { v4: uuidv4 } = require('uuid');
const app = express()

app.use(express.static('public'))

app.listen(3000, () => {
    console.log('Opend port on 3000')
})

const wss = new WebSocket.Server({ port: 8080 })

const connectedClients = new Map()

wss.on('connection', ws => {
    const clientID = uuidv4()
    connectedClients.set(clientID,ws)
    console.log('Client connected: ', clientID)

    ws.on('message', message => {
        console.log('Recieved message: ', message)
        switch (message) {
            case 'LOWER':
                
            break
            case 'LIFT':
            
            break
            case 'ALTER ANGLE':
                
            break
            case 'SETUP SEQUENCE':

            break
        }
    })

    ws.on('close', () => {
        connectedClients.delete(clientID)
        console.log('Client disconnected: ', clientID)
    })
})

wss.broadcast = (msg) => {
    wss.clients.forEach(function each (client) {
        client.send(msg)
    })
}



