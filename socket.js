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
            
                ws.on('message', message => {
                    const msg = JSON.parse(message)
                    if (msg.hasOwnProperty('command')) {
                        this.emit('message',msg)
                    }
                })
            
                ws.on('close', () => {
                    this.connectedClients = this.connectedClients.filter(client => client.clientID !== clientID)
                    console.log('Client disconnected: ', clientID)
                })
            })
        }

        return Socket.instance
    }

    sendMessageToClient(msg,client) {
	console.log('Sending message to client',client)
	//console.log('Connected clients: ', this.wss.clients)
            const clientToSendTo = this.connectedClients.filter(c => c.clientID === client)[0]
	clientToSendTo.ws.send(JSON.stringify(msg))
    }


    sendMessage(msg) {
	console.log('Sending message to all clients', msg)
	    this.wss.clients.forEach(function each (client) {
	        client.send(JSON.stringify(msg))
            })
    }

}