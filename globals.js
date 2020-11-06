const { sendMessage } = require('./socket')
const Socket = require('./socket')

const socket = new Socket()

let state = {
    status: 'RESTING',
    numberOfToothsLeft: 0,
    settings: {
        totalNumberOfTooths: 0,
    }
}

socket.on('connected',(clientID) => {
    socket.sendMessageToClient({status: state.status},clientID)
})


function setStatus(val) {
    state.status = val
    socket.sendMessage({status: state.status})
}

async function setSettings(val) {
    state.settings = val
    socket.sendMessage({settings: state.settings})
}

function setToothsLeft(val) {
    state.numberOfToothsLeft = val
    socket.sendMessage({numberOfToothsLeft: state.numberOfToothsLeft})
}

function getState() {
    return state
}

function getSettings() {
    return state.settings
}

function getToothsLeft(val) {
    return state.numberOfToothsLeft
}

module.exports = { getState, setStatus, setSettings, setToothsLeft, getSettings, getToothsLeft }