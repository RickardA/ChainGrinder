const WebSocket = require('ws')
const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events')

module.exports = class Socket extends EventEmitter {

    constructor() {
        if (!Socket.instance) {
            super()
            Socket.instance = this
            this.wss = new WebSocket.Server({ port: 8080 })
            this.connectedClients = []
            
            this.wss.on('connection', ws => {
                const clientID = uuidv4()
                this.connectedClients.push({clientID,ws})
                console.log('Client connected: ', clientID)
                this.emit('connected',clientID)
                sendMessageToClient(getState(),clientID)
            
                ws.on('message', message => {
                    const msg = JSON.parse(message)
                    if (msg.hasOwnProperty('command')) {
                        this.emit('message',msg)
                    }
                })
            
                ws.on('close', () => {
                    connectedClients.delete(clientID)
                    console.log('Client disconnected: ', clientID)
                })
            })
        }

        return Socket.instance
    }

    sendMessageToClient(msg,client) {
        this.wss.broadcast = (msg) => {
            client  = cthis.onnectedClients.filter(client => client.clientID === client)[0]
            client.send(msg)
        }
    }


    sendMessage(msg) {
        this.wss.broadcast = (msg) => {
            this.wss.clients.forEach(function each (client) {
                client.send(msg)
            })
        }
    }

}