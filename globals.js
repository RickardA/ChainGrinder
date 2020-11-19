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
    socket.sendMessageToClient({type: 'COMPLETE', complete: state},clientID)
})


function setStatus(val) {
    state.status = val
    socket.sendMessage({type: 'STATUS', status: state.status})
}

function setSettings(val) {
    state.settings = val
    socket.sendMessage({type: 'SETTINGS', settings: state.settings})
}

function setToothsLeft(val) {
	console.log('Setting tooths left: ', val)
    state.numberOfToothsLeft = parseInt(val)
    socket.sendMessage({type: 'NUMBEROFTOOTHS', numberOfToothsLeft: state.numberOfToothsLeft})
}

function setTotalNumberOfTooths(val) {
	state.settings.totalNumberOfTooths = val
	socket.sendMessage({type: 'TOTALTOOTHS', value: val})
}

function getState() {
    return state
}

function getStatus() {
	return state.status
}

function getSettings() {
    return state.settings
}

function getToothsLeft() {
    return state.numberOfToothsLeft
}

function getTotalTooths() {
	return state.settings.totalNumberOfTooths
}

module.exports = { getStatus, getState, setStatus, setSettings, setToothsLeft, getSettings, getToothsLeft, setTotalNumberOfTooths, getTotalTooths }
