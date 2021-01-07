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
    socket.sendMessageToClient({ type: 'COMPLETE', complete: state }, clientID)
})


function setStatus (val) {
    state.status = val
    socket.sendMessage({type: 'STATUS', status: val })
}

function setChainClamped (val) {
    state.chainClamped = val
    socket.sendMessage({type: 'CHAINCLAMPED', val })
}

function setGrinderLowered (val) {
    state.grinderLowered = val
    socket.sendMessage({type: 'GRINDERLOWERED', val })
}

function setGrinderOn (val) {
    state.grinderOn = val
    socket.sendMessage({type: 'GRINDERON', val })
}

function setChainPusherState (val) {
    state.pushingChain = val
    socket.sendMessage({type: 'CHAINPUSHER', val })
}

function setAngleAltered (val) {
    state.angleAltered = val
    socket.sendMessage({ type: 'ALTEREDANGLE', val })
}

function setLenghtGrinderActiveState (val) {
    state.lengthGrinderActive = val
    socket.sendMessage({ type: 'LENGHTGRINDER', val })
}

async function setSettings (val) {
    state.settings = val
    socket.sendMessage({ type: 'SETTINGS', settings: val })
}

function setToothsLeft (val) {
    state.numberOfToothsLeft = val
    socket.sendMessage({ type: 'NUMBEROFTOOTHS', numberOfToothsLeft: val })
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

function getStatus() {
	return state.status
}

function getToothsLeft (val) {
    return state.numberOfToothsLeft
}

function getTotalTooths() {
    return state.settings.totalNumberOfTooths
}

module.exports = {
    getState,
    getStatus,
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
