const { sendMessage } = require('./socket')
const Socket = require('./socket')

const socket = new Socket()

let state = {
    status: 'RESTING',
    chainClamped: false,
    grinderLowered: false,
    grinderOn: false,
    pushingChain: false,
    lenghtGrinderActive: false,
    angleAltered: false,
    numberOfToothsLeft: 0,
    settings: {
        totalNumberOfTooths: 0,
    }
}

socket.on('connected', (clientID) => {
    socket.sendMessageToClient({ type: 'COMPLETE', status: state.status }, clientID)
})


function setStatus (val) {
    state.status = val
    socket.sendMessage({type: 'STATUS', status: state.status })
}

function setChainClamped (val) {
    chainClamped = val
    socket.sendMessage({type: 'CHAINCLAMPED', chainClamped: state.chainClamped })
}

function setGrinderLowered (val) {
    grinderLowered = val
    socket.sendMessage({type: 'GRINDERLOWERED', grinderLowered: state.grinderLowered })
}

function setGrinderOn (val) {
    grinderOn = val
    socket.sendMessage({type: 'GRINDERON', grinderOn: state.grinderOn })
}

function setChainPusherState (val) {
    pushingChain = val
    socket.sendMessage({type: 'CHAINPUSHER', pushingChain: state.pushingChain })
}

function setAngleAltered (val) {
    angleAltered = val
    socket.sendMessage({ type: 'ALTEREDANGLE', angleAltered: state.angleAltered })
}

function setLenghtGrinderActiveState (val) {
    lengthGrinderActive = val
    socket.sendMessage({ type: 'LENGHTGRINDER', lenghtGrinderActive: state.lenghtGrinderActive })
}

async function setSettings (val) {
    state.settings = val
    socket.sendMessage({ type: 'SETTINGS', settings: state.settings })
}

function setToothsLeft (val) {
    state.numberOfToothsLeft = val
    socket.sendMessage({ type: 'NUMBEROFTOOTHS', numberOfToothsLeft: state.numberOfToothsLeft })
}

function setTotalNumberOfTooths(val) {
	state.settings.totalNumberOfTooths = val
	socket.sendMessage({type: 'TOTALTOOTHS', value: val})
}

function getState () {
    return state
}

function getSettings () {
    return state.settings
}

function getToothsLeft (val) {
    return state.numberOfToothsLeft
}

function getTotalTooths() {
    return state.settings.totalNumberOfTooths
}

module.exports = {
    getState,
    setStatus,
    setSettings,
    setToothsLeft,
    getSettings,
    getToothsLeft,
    setChainClamped,
    setGrinderLowered,
    setGrinderOn,
    setChainPusherState,
    setLenghtGrinderActiveState,
    setAngleAltered,
    getTotalTooths,
    setTotalNumberOfTooths
}